package com.likelion.last.domain.vote.web.controller;

import com.likelion.last.domain.vote.entity.enums.Sector;
import com.likelion.last.domain.vote.service.VoteService;
import com.likelion.last.domain.vote.web.dto.GetWinnersRes;
import com.likelion.last.global.response.SuccessResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {
    private final VoteService voteService;

    @GetMapping("/winners")
    public ResponseEntity<SuccessResponse<GetWinnersRes>> getWinnersBySector(@RequestParam Sector sector) {
        GetWinnersRes getWinnersRes = voteService.getWinnersBySector(sector);
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.from(getWinnersRes));
    }
}
