package com.likelion.last.domain.vote.service;

import com.likelion.last.domain.vote.entity.VoteWinner;
import com.likelion.last.domain.vote.entity.enums.Sector;
import com.likelion.last.domain.vote.repository.VoteWinnerRepository;
import com.likelion.last.domain.vote.web.dto.GetWinnersRes;
import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.global.external.s3.S3Service;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VoteService {
    private final VoteWinnerRepository voteWinnerRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    public List<String> findWinnerNamesBySector(Sector sector) {
        return voteWinnerRepository.findAllBySectorOrderByIdAsc(sector).stream()
                .map(VoteWinner::getName)
                .toList();
    }

    public boolean isWinner(String name) {
        return !voteWinnerRepository.findAllByNameOrderByIdAsc(name).isEmpty();
    }

    public List<Sector> findWonSectorsByName(String name) {
        return voteWinnerRepository.findAllByNameOrderByIdAsc(name).stream()
                .map(VoteWinner::getSector)
                .toList();
    }

    public GetWinnersRes getWinnersBySector(Sector sector) {
        List<VoteWinner> winners = voteWinnerRepository.findAllBySectorOrderByIdAsc(sector);
        Map<String, User> usersByName = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getName, Function.identity(), (first, second) -> first));
        Map<String, String> imageUrlsByName = winners.stream()
                .collect(Collectors.toMap(
                        VoteWinner::getName,
                        winner -> s3Service.findWinnerImageUrl(winner.getName()),
                        (first, second) -> first
                ));
        return GetWinnersRes.from(winners, usersByName, imageUrlsByName);
    }
}
