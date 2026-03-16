package com.likelion.last.global.auth.oauth2.service;

import com.likelion.last.global.auth.exception.KakaoAuthFailedException;
import com.likelion.last.global.auth.oauth2.dto.KakaoTokenRes;
import com.likelion.last.global.auth.oauth2.dto.KakaoUserInfoRes;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@Slf4j
@RequiredArgsConstructor
public class KakaoService {
    @Value("${oauth.kakao.client-id}")
    private String clientId;

    @Value("${oauth.kakao.redirect-uri}")
    private String redirectUri;

    private final WebClient webClient;

    public KakaoTokenRes getAccessTokenFromKakao(String code) {
        try {
            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", clientId);
            params.add("redirect_uri", redirectUri);
            params.add("code", code);

            return webClient.post()
                    .uri("https://kauth.kakao.com/oauth/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue(params)
                    .retrieve()
                    .onStatus(
                            HttpStatusCode::isError,
                            ClientResponse::createException
                    )
                    .bodyToMono(KakaoTokenRes.class)
                    .block();

        } catch (Exception e) {
            log.warn("Kakao OAuth token request failed", e);
            throw new KakaoAuthFailedException();
        }
    }

    public KakaoUserInfoRes getKakaoUserInfo(String accessToken) {
        try {
            return webClient.post()
                    .uri("https://kapi.kakao.com/v2/user/me")
                    .headers(headers -> headers.setBearerAuth(accessToken))
                    .retrieve()
                    .onStatus(
                            HttpStatusCode::isError,
                            ClientResponse::createException
                    )
                    .bodyToMono(KakaoUserInfoRes.class)
                    .block();
        } catch (Exception e) {
            log.warn("Kakao user info request failed", e);
            throw new KakaoAuthFailedException();
        }
    }
}
