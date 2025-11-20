package com.likelion.last.domain.user.exception;

import com.likelion.last.global.exception.BaseException;

public class UserNotFoundException extends BaseException {
    public UserNotFoundException() {
        super(UserErrorCode.USER_NOT_FOUND_404);
    }
}
