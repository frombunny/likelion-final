package com.likelion.last.domain.chat.exception;

import com.likelion.last.global.exception.BaseException;

public class InvalidChatMessageException extends BaseException {
    public InvalidChatMessageException() {
        super(ChatErrorCode.CHAT_MESSAGE_INVALID_400);
    }
}
