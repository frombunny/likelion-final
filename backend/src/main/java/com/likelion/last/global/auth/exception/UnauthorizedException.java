package com.likelion.last.global.auth.exception;

import com.likelion.last.global.exception.BaseException;

public class UnauthorizedException extends BaseException {
    public UnauthorizedException() {
        super(AuthErrorCode.UNAUTHORIZED_401);
    }
}
