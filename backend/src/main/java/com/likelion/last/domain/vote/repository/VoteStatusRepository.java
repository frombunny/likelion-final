package com.likelion.last.domain.vote.repository;

import com.likelion.last.domain.vote.entity.VoteStatus;
import com.likelion.last.domain.vote.exception.VoteStatusNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteStatusRepository extends JpaRepository<VoteStatus, Long> {
    default VoteStatus getVoteStatus(Long id){
        return findById(id).orElseThrow(VoteStatusNotFoundException::new);
    }
}
