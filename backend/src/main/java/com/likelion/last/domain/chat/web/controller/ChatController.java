package com.likelion.last.domain.chat.web.controller;

import com.likelion.last.domain.chat.service.ChatService;
import com.likelion.last.domain.chat.web.dto.ChatMessageReq;
import com.likelion.last.domain.chat.web.dto.ChatMessageRes;
import com.likelion.last.global.auth.entity.UserPrincipal;
import com.likelion.last.global.auth.exception.UnauthorizedException;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/send")
    public void send(ChatMessageReq chatMessageReq,
                     SimpMessageHeaderAccessor accessor) {

        Object sessionUser = accessor.getSessionAttributes().get("user");

        if (!(sessionUser instanceof Authentication authentication)) {
            throw new UnauthorizedException();
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        ChatMessageRes chatMessageRes = chatService.send(chatMessageReq, userPrincipal);
        simpMessagingTemplate.convertAndSend("/sub/chat", chatMessageRes);
    }
}
