package com.likelion.last.domain.chat.service;

import com.likelion.last.domain.chat.entity.Chat;
import com.likelion.last.domain.chat.exception.InvalidChatMessageException;
import com.likelion.last.domain.chat.repository.ChatRepository;
import com.likelion.last.domain.chat.web.dto.ChatMessageReq;
import com.likelion.last.domain.chat.web.dto.ChatMessageRes;
import com.likelion.last.domain.chat.web.dto.GetAllChatsRes;
import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.global.auth.entity.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatService {
    private static final int MAX_MESSAGE_LENGTH = 300;

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Transactional
    public void send(ChatMessageReq chatMessageReq, UserPrincipal userPrincipal) {
        validate(chatMessageReq.message());
        User user = userRepository.getReferenceById(userPrincipal.getId());

        chatRepository.save(Chat.toEntity(user, chatMessageReq.message()));

        ChatMessageRes chatMessageRes = ChatMessageRes.of(user.getName(), user.getProfileImageUrl(), chatMessageReq);
        simpMessagingTemplate.convertAndSend("/sub/chat", chatMessageRes);
    }

    public GetAllChatsRes getAllChats() {
        return GetAllChatsRes.from(chatRepository.findAllByOrderByCreatedAtAsc());
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
