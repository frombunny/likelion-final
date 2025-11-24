package com.likelion.last.domain.user.web.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginReq(
        @NotBlank(message = "인가 코드 필수 값입니다.")
        String code
) {
}
