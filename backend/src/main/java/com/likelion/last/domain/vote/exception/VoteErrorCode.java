package com.likelion.last.domain.vote.exception;

import com.likelion.last.global.response.code.BaseResponseCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum VoteErrorCode implements BaseResponseCode {
    VOTE_CLOSED_400("VOTE_CLOSED_400", HttpStatus.BAD_REQUEST, "마감된 투표입니다."),
    VOTE_PROGRESS_400("_VOTE_PROGREES_400", HttpStatus.BAD_REQUEST, "투표가 진행 중입니다."),
    DUPLICATE_VOTE_409("DUPLICATE_VOTE_409", HttpStatus.CONFLICT, "이미 해당 부문에 대해 투표를 완료한 상태입니다."),
    SELF_VOTE_NOT_ALLOWED_400("SELF_VOTE_NOT_ALLOWED_400", HttpStatus.BAD_REQUEST, "자기 자신에게는 투표할 수 없습니다.");

    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}
