package com.likelion.last.domain.user.repository;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.exception.UserNotFoundException;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAllByOrderByRoleAscPartAscNameAsc();

    Optional<User> findByKakaoId(Long kakaoId);

    default User getUserByKakaoId(Long kakaoId) {
        return findByKakaoId(kakaoId).orElseThrow(UserNotFoundException::new);
    }

    default User getUserById(Long id) {
        return findById(id).orElseThrow(UserNotFoundException::new);
    }
}
