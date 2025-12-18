package com.likelion.last.domain.chat.web.dto;

public record ChatMessageRes(
        String senderProfileImage,
        String message
) {
    public static ChatMessageRes of(String profileImageUrl, ChatMessageReq chatMessageReq) {
        return new ChatMessageRes(profileImageUrl, chatMessageReq.message());
    }
}
