package com.likelion.last.domain.chat.web.controller;

import com.likelion.last.domain.chat.service.ChatService;
import com.likelion.last.domain.chat.web.dto.ChatMessageReq;
import com.likelion.last.domain.chat.web.dto.GetAllChatsRes;
import com.likelion.last.global.auth.entity.UserPrincipal;
import com.likelion.last.global.auth.exception.UnauthorizedException;
import com.likelion.last.global.response.SuccessResponse;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @GetMapping
    public ResponseEntity<SuccessResponse<GetAllChatsRes>> getAllChats() {
        GetAllChatsRes getAllChatsRes = chatService.getAllChats();
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.from(getAllChatsRes));
    }

    @MessageMapping("/send")
    public void send(ChatMessageReq chatMessageReq, Principal principal) {
        if (!(principal instanceof Authentication authentication)) {
            throw new UnauthorizedException();
        }

        Object principalObj = authentication.getPrincipal();

        if (!(principalObj instanceof UserPrincipal userPrincipal)) {
            throw new UnauthorizedException();
        }

        chatService.send(chatMessageReq, userPrincipal);
    }
}
