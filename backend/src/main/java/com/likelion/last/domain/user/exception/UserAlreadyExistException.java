package com.likelion.last.domain.user.exception;

import com.likelion.last.global.exception.BaseException;

public class UserAlreadyExistException extends BaseException {
    public UserAlreadyExistException() {
        super(UserErrorCode.USER_ALREADY_EXIST_409);
    }
}
