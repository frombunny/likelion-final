package com.likelion.last.domain.vote.web.dto;

public record VoteParticipationRes(
        boolean isParticipated
) {
    public static VoteParticipationRes from(boolean isParticipated){
        return new VoteParticipationRes(isParticipated);
    }
}
