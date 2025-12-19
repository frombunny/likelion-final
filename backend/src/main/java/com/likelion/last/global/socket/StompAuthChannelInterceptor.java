package com.likelion.last.global.socket;

import com.likelion.last.global.auth.JwtTokenProvider;
import com.likelion.last.global.auth.exception.UnauthorizedException;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String token = accessor.getFirstNativeHeader("Authorization");

            if (token == null || token.isBlank()) {
                throw new UnauthorizedException();
            }

            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            jwtTokenProvider.validateToken(token);
            jwtTokenProvider.setSecurityContext(token);

            var authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null) {
                throw new UnauthorizedException();
            }

            accessor.setUser(authentication);

            accessor.getSessionAttributes().put("user", authentication);
        }

        else if (StompCommand.SEND.equals(accessor.getCommand())
                || StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {

            if (accessor.getUser() == null && accessor.getSessionAttributes() != null) {

                Object sessionUser = accessor.getSessionAttributes().get("user");

                if (sessionUser instanceof Principal principal) {
                    accessor.setUser(principal);
                }
            }
        }

        return message;
    }
}