package com.likelion.last.domain.user.web.dto;

import jakarta.validation.constraints.NotNull;

public record TestTokenReq(
        @NotNull(message = "userId는 필수 값입니다.")
        Long userId
) {
}
