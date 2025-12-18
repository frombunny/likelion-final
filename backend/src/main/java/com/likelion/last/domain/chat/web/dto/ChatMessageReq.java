package com.likelion.last.domain.chat.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatMessageReq(
        @NotBlank(message = "메시지는 비어 있을 수 없습니다.")
        @Size(max = 300, message = "메시지는 300자를 초과할 수 없습니다.")
        String message
) {
}
