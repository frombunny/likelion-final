package com.likelion.last.domain.chat.repository;

import com.likelion.last.domain.chat.entity.Chat;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    @EntityGraph(attributePaths = "user")
    List<Chat> findAllByOrderByCreatedAtAsc();
}
