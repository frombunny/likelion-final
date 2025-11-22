package com.likelion.last.domain.vote.service;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.domain.vote.entity.Vote;
import com.likelion.last.domain.vote.entity.enums.Sector;
import com.likelion.last.domain.vote.exception.DuplicateVoteException;
import com.likelion.last.domain.vote.exception.SelfVoteNotAllowedException;
import com.likelion.last.domain.vote.repository.VoteRepository;
import com.likelion.last.domain.vote.web.dto.VoteReq;
import com.likelion.last.global.auth.UserPrincipal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final UserRepository userRepository;
    private final VoteRepository voteRepository;

    @Transactional
    public void vote(UserPrincipal user, VoteReq voteReq) {
        User voter = userRepository.getUserById(user.getId());

        validateVoteDuplicate(voter, voteReq);

        List<Vote> votes = voteReq.voteItems().stream()
                .flatMap(item -> item.users().stream()
                        .map(targetId -> {
                            User target = userRepository.getUserById(targetId);

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
}
