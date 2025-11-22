package com.likelion.last.domain.user.web.controller;

import com.likelion.last.domain.user.service.UserService;
import com.likelion.last.domain.user.web.dto.GetAllUserRes;
import com.likelion.last.domain.user.web.dto.SignUpReq;
import com.likelion.last.global.response.SuccessResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ResponseEntity<SuccessResponse<Void>> signUp(@Valid @RequestBody SignUpReq signUpReq) {
        userService.signUp(signUpReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(SuccessResponse.empty());
    }

    @GetMapping("/all")
    public ResponseEntity<SuccessResponse<GetAllUserRes>> getAllUser() {
        GetAllUserRes getAllUserRes = userService.getAllUsers();
        return ResponseEntity.status(HttpStatus.OK).body(SuccessResponse.from(getAllUserRes));
    }
}
