package com.likelion.last.domain.user.service;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.exception.UserAlreadyExistException;
import com.likelion.last.domain.user.exception.UserNotFoundException;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.domain.user.web.dto.GetAllUserRes;
import com.likelion.last.domain.user.web.dto.LoginReq;
import com.likelion.last.domain.user.web.dto.LoginRes;
import com.likelion.last.domain.user.web.dto.SignUpReq;
import com.likelion.last.global.auth.JwtTokenProvider;
import com.likelion.last.global.auth.oauth2.service.KakaoService;
import com.likelion.last.global.auth.oauth2.dto.KakaoTokenRes;
import com.likelion.last.global.auth.oauth2.dto.KakaoUserInfoRes;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final KakaoService kakaoService;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public void signUp(SignUpReq signUpReq) {
        if (userRepository.findByKakaoId(signUpReq.kakaoId()).isPresent()) {
            throw new UserAlreadyExistException();
        }

        User user = signUpReq.toEntity();
        userRepository.save(user);
    }

    public LoginRes login(LoginReq loginReq) {
        KakaoTokenRes kakaoTokenRes = kakaoService.getAccessTokenFromKakao(loginReq.code());
        KakaoUserInfoRes kakaoUserInfoRes = kakaoService.getKakaoUserInfo(kakaoTokenRes.accessToken());

        Optional<User> user = userRepository.findByKakaoId(kakaoUserInfoRes.id());
        if(user.isEmpty()){
            return LoginRes.signUpRequired(kakaoUserInfoRes);
        }

        String jwt = jwtTokenProvider.createToken(user.get().getId());
        return LoginRes.success(jwt);
    }

    public GetAllUserRes getAllUsers() {
        List<User> users = userRepository.findAllByOrderByRoleAscPartAscNameAsc();
        return GetAllUserRes.from(users);
    }
}
