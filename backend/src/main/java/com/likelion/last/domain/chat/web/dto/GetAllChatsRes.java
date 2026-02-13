package com.likelion.last.domain.chat.web.dto;

import com.likelion.last.domain.chat.entity.Chat;
import java.util.List;

public record GetAllChatsRes(
        int count,
        List<GetOneChatRes> chats
) {
    public record GetOneChatRes(
            String senderName,
            String senderProfileImage,
            String message
    ) {
        public static GetOneChatRes from(Chat chat) {
            return new GetOneChatRes(
                    chat.getUser().getName(),
                    chat.getUser().getProfileImageUrl(),
                    chat.getMessage()
            );
        }
    }

    public static GetAllChatsRes from(List<Chat> chats) {
        return new GetAllChatsRes(
                chats.size(),
                chats.stream()
                        .map(GetOneChatRes::from)
                        .toList()
        );
    }
}
