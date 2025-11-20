package com.likelion.last.domain.user.exception;

import com.likelion.last.global.exception.BaseException;

public class CanNotAccessException extends BaseException {
    public CanNotAccessException() {
        super(UserErrorCode.CAN_NOT_ACCESS_403);
    }
}
