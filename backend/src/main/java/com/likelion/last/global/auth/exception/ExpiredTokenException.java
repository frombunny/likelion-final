package com.likelion.last.global.auth.exception;

import com.likelion.last.global.exception.BaseException;

public class ExpiredTokenException extends BaseException {
    public ExpiredTokenException(){
        super(AuthErrorCode.EXPIRED_TOKEN_401);
    }
}
