package com.likelion.last.domain.vote.exception;

import com.likelion.last.global.exception.BaseException;

public class SelfVoteNotAllowedException extends BaseException {
    public SelfVoteNotAllowedException(){
        super(VoteErrorCode.SELF_VOTE_NOT_ALLOWED_400);
    }
}
