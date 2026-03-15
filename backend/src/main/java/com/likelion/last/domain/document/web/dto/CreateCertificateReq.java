package com.likelion.last.domain.document.web.dto;

import com.likelion.last.domain.user.entity.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCertificateReq(
        @NotBlank(message = "이름은 필수 값입니다.") String name,
        @NotNull(message = "직위는 필수 값입니다.") Role role
) {
}
