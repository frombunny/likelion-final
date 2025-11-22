package com.likelion.last.domain.user.service;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.exception.UserAlreadyExistException;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.domain.user.web.dto.GetAllUserRes;
import com.likelion.last.domain.user.web.dto.SignUpReq;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public void signUp(SignUpReq signUpReq) {
        if (userRepository.findByKakaoId(signUpReq.kakaoId()).isPresent()) {
            throw new UserAlreadyExistException();
        }

        User user = signUpReq.toEntity();
        userRepository.save(user);
    }

    public GetAllUserRes getAllUsers() {
        List<User> users = userRepository.findAllByOrderByRoleAscPartAscNameAsc();

        return GetAllUserRes.from(users);
    }


}
