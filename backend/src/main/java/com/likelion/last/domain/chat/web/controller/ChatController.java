package com.likelion.last.domain.chat.web.controller;

import com.likelion.last.domain.chat.service.ChatService;
import com.likelion.last.domain.chat.web.dto.ChatMessageReq;
import com.likelion.last.domain.chat.web.dto.ChatMessageRes;
import com.likelion.last.global.auth.entity.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat")
    public void send(ChatMessageReq chatMessageReq, @AuthenticationPrincipal UserPrincipal userPrincipal){
        ChatMessageRes chatMessageRes = chatService.send(chatMessageReq, userPrincipal);
        simpMessagingTemplate.convertAndSend("/sub/chat", chatMessageRes);
    }
}
