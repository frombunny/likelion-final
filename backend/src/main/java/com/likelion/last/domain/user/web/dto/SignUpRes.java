package com.likelion.last.domain.user.web.dto;

import com.likelion.last.domain.user.entity.User;

public record SignUpRes(
        String accessToken,
        GetMeRes user
) {
    public static SignUpRes of(String accessToken, User user) {
        return new SignUpRes(accessToken, GetMeRes.from(user));
    }
}
