package com.likelion.last.domain.user.web.controller;

import com.likelion.last.domain.user.service.UserService;
import com.likelion.last.domain.user.web.dto.GetMeRes;
import com.likelion.last.domain.user.web.dto.LoginReq;
import com.likelion.last.domain.user.web.dto.LoginRes;
import com.likelion.last.domain.user.web.dto.SignUpReq;
import com.likelion.last.domain.user.web.dto.SignUpRes;
import com.likelion.last.global.auth.entity.UserPrincipal;
import com.likelion.last.global.response.SuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<SuccessResponse<GetMeRes>> getMe(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        GetMeRes getMeRes = userService.getMe(userPrincipal);
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.from(getMeRes));
    }

    @PostMapping
    public ResponseEntity<SuccessResponse<SignUpRes>> signUp(@Valid @RequestBody SignUpReq signUpReq) {
        SignUpRes signUpRes = userService.signUp(signUpReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(SuccessResponse.from(signUpRes));
    }

    @PostMapping("/login")
    public ResponseEntity<SuccessResponse<LoginRes>> login(@Valid @RequestBody LoginReq loginReq){
        LoginRes loginRes = userService.login(loginReq);
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.from(loginRes));
    }

}
