package com.likelion.last.domain.vote.repository;

import com.likelion.last.domain.vote.entity.VoteWinner;
import com.likelion.last.domain.vote.entity.enums.Sector;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteWinnerRepository extends JpaRepository<VoteWinner, Long> {
    @EntityGraph(attributePaths = "user")
    List<VoteWinner> findAllBySectorOrderByIdAsc(Sector sector);
}
