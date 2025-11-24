package com.likelion.last.domain.user.exception;

import com.likelion.last.global.auth.oauth2.dto.KakaoUserInfoRes;
import com.likelion.last.global.exception.BaseException;

public class UserNotFoundException extends BaseException {
    private KakaoUserInfoRes kakaoUserInfoRes;

    public UserNotFoundException() {
        super(UserErrorCode.USER_NOT_FOUND_404);
    }


    public UserNotFoundException(KakaoUserInfoRes kakaoUserInfoRes) {
        super(UserErrorCode.USER_NOT_FOUND_404);
        this.kakaoUserInfoRes = kakaoUserInfoRes;
    }

    public KakaoUserInfoRes getKakaoInfo() {
        return kakaoUserInfoRes;
    }
}
