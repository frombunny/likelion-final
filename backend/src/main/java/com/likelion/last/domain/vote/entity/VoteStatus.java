package com.likelion.last.domain.vote.entity;

import com.likelion.last.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "vote_status")
public class VoteStatus extends BaseEntity {
    @Id
    @Column(name = "vote_status_id")
    private Long id;

    @Column(name = "is_open", nullable = false)
    private boolean isOpen;

    public void changeVoteStatus() {
        this.isOpen = !this.isOpen;
    }
}
