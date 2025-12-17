package com.likelion.last.global.auth.exception;

import com.likelion.last.global.exception.BaseException;

public class KakaoAuthFailedException extends BaseException {
    public KakaoAuthFailedException(){
        super(AuthErrorCode.KAKAO_AUTH_FAILED_500);
    }
}
