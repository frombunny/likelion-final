package com.likelion.last.domain.user.exception;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.CONFLICT;

import com.likelion.last.global.response.code.BaseResponseCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum UserErrorCode implements BaseResponseCode {
    USER_NOT_FOUND_404("USER_NOT_FOUND_404", NOT_FOUND, "존재하지 않는 사용자입니다."),
    USER_ALREADY_EXIST_409("USER_ALREADY_EXIST_409", CONFLICT, "이미 존재하는 사용자입니다.");

    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}
