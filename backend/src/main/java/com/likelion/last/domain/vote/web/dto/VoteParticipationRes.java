package com.likelion.last.domain.vote.web.dto;

public record VoteParticipationRes(
        boolean isParticipated,
        boolean isOpen
) {
    public static VoteParticipationRes from(boolean isParticipated, boolean isOpen){
        return new VoteParticipationRes(isParticipated, isOpen);
    }
}
