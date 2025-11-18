package com.likelion.last.global.response.code;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GlobalSuccessResponseCode implements BaseResponseCode {
    SUCCESS_OK("SUCCESS_200", OK, "호출에 성공하였습니다."),
    SUCCESS_CREATED("CREATED_201", CREATED, "호출에 성공하였습니다.");

    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}
