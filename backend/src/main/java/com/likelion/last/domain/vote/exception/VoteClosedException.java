package com.likelion.last.domain.vote.exception;

import com.likelion.last.global.exception.BaseException;

public class VoteClosedException extends BaseException {
    public VoteClosedException() {
        super(VoteErrorCode.VOTE_CLOSED_400);
    }
}
