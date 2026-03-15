package com.likelion.last.domain.vote.service;

import com.likelion.last.domain.vote.entity.VoteWinner;
import com.likelion.last.domain.vote.entity.enums.Sector;
import com.likelion.last.domain.vote.repository.VoteWinnerRepository;
import com.likelion.last.domain.vote.web.dto.GetWinnersRes;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VoteService {
    private final VoteWinnerRepository voteWinnerRepository;

    public List<String> findWinnerNamesBySector(Sector sector) {
        return voteWinnerRepository.findAllBySectorOrderByIdAsc(sector).stream()
                .map(VoteWinner::getName)
                .toList();
    }

    public GetWinnersRes getWinnersBySector(Sector sector) {
        return GetWinnersRes.from(findWinnerNamesBySector(sector));
    }
}
