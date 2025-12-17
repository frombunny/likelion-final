package com.likelion.last.domain.user.web.dto;

import com.likelion.last.domain.user.web.dto.enums.LoginStatus;
import com.likelion.last.global.auth.oauth2.dto.KakaoUserInfoRes;

public record LoginRes(
        LoginStatus status,
        String accessToken,
        KakaoUserInfoRes kakaoInfo
) {
    public static LoginRes success(String token) {
        return new LoginRes(LoginStatus.LOGIN_SUCCESS, token, null);
    }

    public static LoginRes signUpRequired(KakaoUserInfoRes kakaoInfo) {
        return new LoginRes(LoginStatus.SIGNUP_REQUIRED, null, kakaoInfo);
    }
}
