package com.likelion.last.domain.user.web.dto;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.entity.enums.Part;
import com.likelion.last.domain.user.entity.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SignUpReq(
        @NotBlank String name,
        @NotNull Part part,
        @NotNull Role role,
        @NotBlank String kakaoId,
        String profileImageUrl
) {
    public User toEntity() {
        return User.builder()
                .name(name())
                .part(part())
                .role(role())
                .profileImageUrl(profileImageUrl())
                .kakaoId(kakaoId())
                .build();
    }
}
