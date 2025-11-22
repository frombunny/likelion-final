package com.likelion.last.domain.vote.exception;

import com.likelion.last.global.response.code.BaseResponseCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum VoteStatusErrorCode implements BaseResponseCode {
    VOTE_STATUS_NOT_FOUND("VOTE_STATUS_NOT_FOUND_404", HttpStatus.NOT_FOUND, "투표 상태를 찾을 수 없습니다.");

    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}
