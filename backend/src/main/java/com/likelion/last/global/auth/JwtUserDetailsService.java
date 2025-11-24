package com.likelion.last.global.auth;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.exception.UserNotFoundException;
import com.likelion.last.domain.user.repository.UserRepository;
import com.likelion.last.global.auth.entity.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("jwtDetailsService")
@RequiredArgsConstructor
public class JwtUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        try {
            User user = userRepository.getUserById(Long.parseLong(userId));
            return new UserPrincipal(user);
        } catch (UserNotFoundException e) {
            throw new UsernameNotFoundException(e.getMessage(), e);
        }
    }
}
