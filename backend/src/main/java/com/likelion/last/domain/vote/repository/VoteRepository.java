package com.likelion.last.domain.vote.repository;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.vote.entity.Vote;
import com.likelion.last.domain.vote.entity.enums.Sector;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByVoterAndSector(User voter, Sector sector);

    boolean existsByVoter(User voter);

    @Query("""
            select v.sector as sector , v.target.id as targetId, count(v) as voteCount
            from Vote v
            group by v.sector, v.target.id
            having v.sector = :sector
            order by count(v) desc
            """)
    List<VoteCountProjection> findBySectorWithVoteCount(Sector sector);

    interface VoteCountProjection {
        Sector getSector();
        Long getTargetId();
        Long getVoteCount();
    }
}
