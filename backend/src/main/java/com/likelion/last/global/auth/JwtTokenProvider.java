package com.likelion.last.global.auth;

import com.likelion.last.global.auth.exception.ExpiredTokenException;
import com.likelion.last.global.auth.exception.InvalidTokenException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    private static final int BEARER_TOKEN_START_INDEX = 7;
    private final JwtUserDetailsService jwtDetailsService;

    @Value("${application.security.jwt.secret}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long validityInSeconds;

    public String createToken(Long id) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + validityInSeconds);

        return Jwts.builder().setSubject(String.valueOf(id)).setIssuedAt(now).setExpiration(expiration)
                .signWith(getSignKey(secretKey), SignatureAlgorithm.HS256).compact();
    }

    public boolean validateToken(String token) {
        if (token == null || token.isEmpty()) {
            throw new InvalidTokenException();
        }
        try {
            Claims claims = getClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            throw new ExpiredTokenException();
        }
    }

    public String resolveToken(HttpServletRequest httpServletRequest) {
        String bearerToken = httpServletRequest.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(BEARER_TOKEN_START_INDEX);
        }
        return null;
    }

    public void setSecurityContext(String token) {
        Claims claims = getClaims(token);
        String userId = claims.getSubject();

        UserDetails userDetails = jwtDetailsService.loadUserByUsername(userId);

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private SecretKey getSignKey(String secretKey) {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    private Claims getClaims(String token) {
        return Jwts.parser().verifyWith(getSignKey(secretKey)).build().parseSignedClaims(token).getPayload();
    }
}
