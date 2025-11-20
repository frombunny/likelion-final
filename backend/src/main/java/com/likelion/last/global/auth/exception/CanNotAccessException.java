package com.likelion.last.global.auth.exception;

import com.likelion.last.global.exception.BaseException;

public class CanNotAccessException extends BaseException {
    public CanNotAccessException() {
        super(AuthErrorCode.CAN_NOT_ACCESS_403);
    }
}
