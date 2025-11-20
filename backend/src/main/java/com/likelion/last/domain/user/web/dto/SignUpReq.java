package com.likelion.last.domain.user.web.dto;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.entity.enums.Part;
import com.likelion.last.domain.user.entity.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SignUpReq(
        @NotBlank(message = "이름은 필수 값입니다.") String name,
        @NotNull(message = "파트는 필수 값입니다.") Part part,
        @NotNull(message = "역할은 필수 값입니다.") Role role,
        @NotBlank(message = "카카오 아이디는 필수 값입니다.") String kakaoId,
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
