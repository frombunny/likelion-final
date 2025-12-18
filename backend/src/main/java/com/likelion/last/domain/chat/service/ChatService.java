package com.likelion.last.domain.chat.service;

import com.likelion.last.domain.chat.exception.InvalidChatMessageException;
import com.likelion.last.domain.chat.web.dto.ChatMessageReq;
import com.likelion.last.domain.chat.web.dto.ChatMessageRes;
import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.global.auth.entity.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {
    private static final int MAX_MESSAGE_LENGTH = 300;

    public ChatMessageRes send(ChatMessageReq chatMessageReq, UserPrincipal userPrincipal) {
        validate(chatMessageReq.message());

        return ChatMessageRes.of(userPrincipal.getProfileImageUrl(), chatMessageReq);
    }

    private void validate(String message) {
        if (message == null || message.isBlank()) {
            throw new InvalidChatMessageException();
        }
        if (message.length() > MAX_MESSAGE_LENGTH) {
            throw new InvalidChatMessageException();
        }
    }
}
