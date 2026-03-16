package com.likelion.last.domain.user.web.dto;

public record TestTokenRes(
        Long userId,
        String accessToken,
        String bearerToken
) {
    public static TestTokenRes of(Long userId, String accessToken) {
        return new TestTokenRes(
                userId,
                accessToken,
                "Bearer " + accessToken
        );
    }
}
