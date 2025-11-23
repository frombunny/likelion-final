package com.likelion.last.domain.vote.exception;

import com.likelion.last.global.exception.BaseException;

public class VoteProgressException extends BaseException {
    public VoteProgressException() {
        super(VoteErrorCode.VOTE_PROGRESS_400);
    }
}
