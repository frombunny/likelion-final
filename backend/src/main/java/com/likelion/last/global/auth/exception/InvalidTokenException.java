package com.likelion.last.global.auth.exception;

import com.likelion.last.global.exception.BaseException;

public class InvalidTokenException extends BaseException {
    public InvalidTokenException() {
        super(AuthErrorCode.INVALID_TOKEN_401);
    }
}
