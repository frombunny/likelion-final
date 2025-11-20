package com.likelion.last.global.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.likelion.last.domain.user.exception.UserErrorCode;
import com.likelion.last.global.auth.exception.AuthErrorCode;
import com.likelion.last.global.response.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        ErrorResponse<?> errorResponse;

        if (authException instanceof UsernameNotFoundException) {
            errorResponse = ErrorResponse.from(UserErrorCode.USER_NOT_FOUND_404);
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        } else if (authException instanceof AuthenticationServiceException) {
            errorResponse = ErrorResponse.from(AuthErrorCode.INVALID_TOKEN_401);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            errorResponse = ErrorResponse.from(AuthErrorCode.UNAUTHORIZED_401);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }

        response.setContentType("application/json;charset=UTF-8");
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
