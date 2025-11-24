package com.likelion.last.global.auth.exception;

import com.likelion.last.global.exception.BaseException;

public class KakaoLoginFailedException extends BaseException {
    public KakaoLoginFailedException(){
        super(AuthErrorCode.KAKAO_LOGIN_FAILED_500);
    }
}
