package com.likelion.last.global.auth.exception;

import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;


import com.likelion.last.global.response.code.BaseResponseCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum AuthErrorCode implements BaseResponseCode {
    INVALID_TOKEN_401("INVALID_TOKEN_401", UNAUTHORIZED, "올바르지 않은 토큰입니다."),
    EXPIRED_TOKEN_401("EXPIRED_TOKEN_401", UNAUTHORIZED, "만료된 토큰입니다."),
    UNAUTHORIZED_401("UNAUTHORIZED_401", UNAUTHORIZED, "인증되지 않은 사용자입니다."),
    CAN_NOT_ACCESS_403("CAN_NOT_ACCESS_403", FORBIDDEN, "접근 권한이 없습니다."),
    KAKAO_AUTH_FAILED_500("KAKAO_AUTH_FAILED_500", INTERNAL_SERVER_ERROR, "카카오 서버와의 통신에 실패했습니다.");

    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}
