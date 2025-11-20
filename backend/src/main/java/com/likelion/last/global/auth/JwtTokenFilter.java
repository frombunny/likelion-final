package com.likelion.last.global.auth;

import com.likelion.last.global.auth.exception.InvalidTokenException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse,
                                 FilterChain filterChain) throws IOException, ServletException {
        try {
            String token = jwtTokenProvider.resolveToken(httpServletRequest);
            if (token != null && !token.isEmpty()) {
                jwtTokenProvider.validateToken(token);
                jwtTokenProvider.setSecurityContext(token);
            }
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        } catch (InvalidTokenException e) {
            throw new AuthenticationServiceException("INVALID_TOKEN", e);
        }
    }
}
