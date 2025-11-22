package com.likelion.last.domain.vote.exception;

import com.likelion.last.global.exception.BaseException;

public class VoteStatusNotFoundException extends BaseException {
    public VoteStatusNotFoundException() {
        super(VoteStatusErrorCode.VOTE_STATUS_NOT_FOUND);
    }
}
