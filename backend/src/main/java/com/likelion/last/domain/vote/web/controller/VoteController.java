package com.likelion.last.domain.vote.web.controller;

import com.likelion.last.domain.vote.entity.enums.Sector;
import com.likelion.last.domain.vote.service.VoteService;
import com.likelion.last.domain.vote.web.dto.GetWinnersRes;
import com.likelion.last.domain.vote.web.dto.VoteReq;
import com.likelion.last.global.auth.UserPrincipal;
import com.likelion.last.global.response.SuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {
    private final VoteService voteService;

    @PostMapping
    public ResponseEntity<SuccessResponse<?>> vote(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                   @Valid @RequestBody VoteReq voteReq) {
        voteService.vote(userPrincipal, voteReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(SuccessResponse.empty());
    }

    @GetMapping("/winners")
    public ResponseEntity<SuccessResponse<GetWinnersRes>> getWinnersBySector(@RequestParam Sector sector) {
        GetWinnersRes getWinnersRes = voteService.getWinnersBySector(sector);
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.from(getWinnersRes));
    }

    @PutMapping
    public ResponseEntity<SuccessResponse<Void>> changeVoteStatus(@AuthenticationPrincipal UserPrincipal userPrincipal){
        voteService.changeVoteStatus(userPrincipal);
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.empty());
    }
}
