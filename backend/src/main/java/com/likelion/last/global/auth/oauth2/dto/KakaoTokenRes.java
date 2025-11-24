package com.likelion.last.global.auth.oauth2.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record KakaoTokenRes(
        @JsonProperty("access_token")
        String accessToken
) {
}
