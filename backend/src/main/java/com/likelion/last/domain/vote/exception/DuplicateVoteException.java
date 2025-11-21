package com.likelion.last.domain.vote.exception;

import com.likelion.last.global.exception.BaseException;

public class DuplicateVoteException extends BaseException {
    public DuplicateVoteException(){
        super(VoteErrorCode.DUPLICATE_VOTE_409);
    }
}
