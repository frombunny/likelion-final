package com.likelion.last.domain.vote.repository;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.vote.entity.Vote;
import com.likelion.last.domain.vote.entity.enums.Sector;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByVoterAndSector(User voter, Sector sector);
}
