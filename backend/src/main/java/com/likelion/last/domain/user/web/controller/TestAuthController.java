package com.likelion.last.domain.user.web.controller;

import com.likelion.last.domain.user.service.UserService;
import com.likelion.last.domain.user.web.dto.TestTokenReq;
import com.likelion.last.domain.user.web.dto.TestTokenRes;
import com.likelion.last.global.response.SuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestAuthController {
    private final UserService userService;

    @PostMapping("/token")
    public ResponseEntity<SuccessResponse<TestTokenRes>> createTestToken(
            @Valid @RequestBody TestTokenReq testTokenReq
    ) {
        TestTokenRes testTokenRes = userService.createTestToken(testTokenReq.userId());
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.from(testTokenRes));
    }
}
