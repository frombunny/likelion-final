package com.likelion.last.domain.chat.web.dto;

public record ChatMessageRes(
        String senderName,
        String senderProfileImage,
        String message
) {
    public static ChatMessageRes of(String senderName, String profileImageUrl, ChatMessageReq chatMessageReq) {
        return new ChatMessageRes(senderName, profileImageUrl, chatMessageReq.message());
    }
}
