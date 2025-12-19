package com.likelion.last.domain.vote.service;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.entity.enums.Role;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.domain.vote.entity.Vote;
import com.likelion.last.domain.vote.entity.VoteStatus;
import com.likelion.last.domain.vote.entity.enums.Sector;
import com.likelion.last.domain.vote.exception.DuplicateVoteException;
import com.likelion.last.domain.vote.exception.SelfVoteNotAllowedException;
import com.likelion.last.domain.vote.exception.VoteClosedException;
import com.likelion.last.domain.vote.exception.VoteProgressException;
import com.likelion.last.domain.vote.repository.VoteRepository;
import com.likelion.last.domain.vote.repository.VoteRepository.VoteCountProjection;
import com.likelion.last.domain.vote.repository.VoteStatusRepository;
import com.likelion.last.domain.vote.web.dto.GetWinnersRes;
import com.likelion.last.domain.vote.web.dto.VoteParticipationRes;
import com.likelion.last.domain.vote.web.dto.VoteReq;
import com.likelion.last.global.auth.entity.UserPrincipal;
import com.likelion.last.global.auth.exception.CanNotAccessException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VoteService {
    private static final Long VOTE_STATUS_ID = 1L;

    private final UserRepository userRepository;
    private final VoteRepository voteRepository;
    private final VoteStatusRepository voteStatusRepository;

    @Transactional
    public void vote(UserPrincipal userPrincipal, VoteReq voteReq) {
        validateVoteIsOpened();

        User voter = userRepository.getUserById(userPrincipal.getId());

        validateVoteDuplicate(voter, voteReq);

        Set<Long> targetIds = voteReq.voteItems().stream()
                .flatMap(item -> item.users().stream())
                .collect(Collectors.toSet());

        Map<Long, User> targetMap = userRepository.findAllById(targetIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        List<Vote> votes = voteReq.voteItems().stream()
                .flatMap(item -> item.users().stream()
                        .map(targetId -> {
                            User target = targetMap.get(targetId);
                            validateSelfVote(voter, target);

                            return Vote.builder()
                                    .sector(item.sector())
                                    .voter(voter)
                                    .target(target)
                                    .build();
                        })
                )
                .toList();

        voteRepository.saveAll(votes);
    }

    @Transactional
    public void changeVoteStatus(UserPrincipal userPrincipal) {
        User user = userRepository.getUserById(userPrincipal.getId());

        if (!user.getRole().equals(Role.ROLE_LEADER)) {
            throw new CanNotAccessException();
        }

        VoteStatus voteStatus = voteStatusRepository.getVoteStatus(VOTE_STATUS_ID);
        voteStatus.changeVoteStatus();
    }

    public VoteParticipationRes getVoteParticipationStatus(UserPrincipal userPrincipal) {
        User user = userRepository.getUserById(userPrincipal.getId());
        VoteStatus voteStatus = voteStatusRepository.getVoteStatus(VOTE_STATUS_ID);

        return VoteParticipationRes.from(voteRepository.existsByVoter(user), voteStatus.isOpen());
    }

    public void validateVoteIsClosed() {
        if (voteStatusRepository.getVoteStatus(VOTE_STATUS_ID).isOpen()) {
            throw new VoteProgressException();
        }
    }

    public List<User> findWinnersBySector(Sector sector) {
        return calculateWinnersBySector(sector);
    }

    public GetWinnersRes getWinnersBySector(Sector sector) {
        return GetWinnersRes.from(calculateWinnersBySector(sector));
    }

    private List<User> calculateWinnersBySector(Sector sector) {
        validateVoteIsClosed();
        List<VoteCountProjection> votes = voteRepository.findBySectorWithVoteCount(sector);
        if (votes.isEmpty()) {
            return List.of();
        }

        Set<Long> winnerIds = getWinnersId(votes);
        return userRepository.findAllById(winnerIds);
    }

    private void validateVoteDuplicate(User voter, VoteReq voteReq) {
        Set<Sector> sectors = new HashSet<>();
        for (VoteReq.VoteItem item : voteReq.voteItems()) {
            if (!sectors.add(item.sector())) {
                throw new DuplicateVoteException();
            }

            if (voteRepository.existsByVoterAndSector(voter, item.sector())) {
                throw new DuplicateVoteException();
            }
        }
    }

    private void validateSelfVote(User voter, User target) {
        if (voter.equals(target)) {
            throw new SelfVoteNotAllowedException();
        }
    }

    private void validateVoteIsOpened() {
        if (!voteStatusRepository.getVoteStatus(VOTE_STATUS_ID).isOpen()) {
            throw new VoteClosedException();
        }
    }

    private Set<Long> getWinnersId(List<VoteRepository.VoteCountProjection> votesCountPerUser) {
        Set<Long> winnerIds = new HashSet<>();
        Long mostCountOfVotes = votesCountPerUser.getFirst().getVoteCount();

        votesCountPerUser.stream()
                .filter(v -> v.getVoteCount().equals(mostCountOfVotes))
                .forEach(v -> winnerIds.add(v.getTargetId()));

        if (winnerIds.size() < 2) {
            Long secondCountOfVotes = votesCountPerUser.stream()
                    .map(VoteCountProjection::getVoteCount)
                    .filter(v -> !v.equals(mostCountOfVotes))
                    .findFirst()
                    .orElse(null);

            votesCountPerUser.stream()
                    .filter(v -> v.getVoteCount().equals(secondCountOfVotes))
                    .forEach(v -> winnerIds.add(v.getTargetId()));
        }

        return winnerIds;
    }
}
