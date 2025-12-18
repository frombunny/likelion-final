package com.likelion.last.domain.chat.exception;

import com.likelion.last.global.response.code.BaseResponseCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ChatErrorCode implements BaseResponseCode {
    CHAT_MESSAGE_INVALID_400("CHAT_MESSAGE_INVALID_400", HttpStatus.BAD_REQUEST, "채팅 메시지 형식이 올바르지 않습니다.");

    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}
