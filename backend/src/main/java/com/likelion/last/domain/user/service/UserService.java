package com.likelion.last.domain.user.service;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.exception.UserAlreadyExistException;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.domain.user.web.dto.LoginReq;
import com.likelion.last.domain.user.web.dto.LoginRes;
import com.likelion.last.domain.user.web.dto.GetMeRes;
import com.likelion.last.domain.user.web.dto.SignUpReq;
import com.likelion.last.domain.user.web.dto.SignUpRes;
import com.likelion.last.domain.user.web.dto.TestTokenRes;
import com.likelion.last.global.auth.entity.UserPrincipal;
import com.likelion.last.global.auth.JwtTokenProvider;
import com.likelion.last.global.auth.oauth2.service.KakaoService;
import com.likelion.last.global.auth.oauth2.dto.KakaoTokenRes;
import com.likelion.last.global.auth.oauth2.dto.KakaoUserInfoRes;
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
    public SignUpRes signUp(SignUpReq signUpReq) {
        if (userRepository.findByKakaoId(signUpReq.kakaoId()).isPresent()) {
            throw new UserAlreadyExistException();
        }

        User user = signUpReq.toEntity();
        User savedUser = userRepository.save(user);
        String jwt = jwtTokenProvider.createToken(savedUser.getId());
        return SignUpRes.of(jwt, savedUser);
    }

    public LoginRes login(LoginReq loginReq) {
        KakaoTokenRes kakaoTokenRes = kakaoService.getAccessTokenFromKakao(loginReq.code());
        KakaoUserInfoRes kakaoUserInfoRes = kakaoService.getKakaoUserInfo(kakaoTokenRes.accessToken());

        Optional<User> user = userRepository.findByKakaoId(kakaoUserInfoRes.id());
        if(user.isEmpty()){
            return LoginRes.signUpRequired(kakaoUserInfoRes);
        }

        String jwt = jwtTokenProvider.createToken(user.get().getId());
        return LoginRes.success(jwt, user.get());
    }

    public TestTokenRes createTestToken(Long userId) {
        User user = userRepository.getUserById(userId);
        String jwt = jwtTokenProvider.createToken(user.getId());
        return TestTokenRes.of(user.getId(), jwt);
    }

    public GetMeRes getMe(UserPrincipal userPrincipal) {
        User user = userRepository.getUserById(userPrincipal.getId());
        return GetMeRes.from(user);
    }
}
