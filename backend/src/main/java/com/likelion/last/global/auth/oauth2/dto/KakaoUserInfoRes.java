package com.likelion.last.global.auth.oauth2.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KakaoUserInfoRes(
        Long id,
        @JsonProperty("kakao_account")
        KakaoAccount kakaoAccount
) {
    public record KakaoAccount(
            Profile profile
    ) {
    }

    public record Profile(
            String nickname,
            @JsonProperty("profile_image_url")
            String profileImageUrl
    ) {
    }
}

