package com.likelion.last.global.response.code;

import org.springframework.http.HttpStatus;

public interface BaseResponseCode {
    String getCode();
    String getMessage();
    HttpStatus getHttpStatus();
}
