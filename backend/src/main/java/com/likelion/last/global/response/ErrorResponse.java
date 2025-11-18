package com.likelion.last.global.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.likelion.last.global.response.code.BaseResponseCode;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@JsonPropertyOrder({"isSuccess", "timestamp", "httpStatus", "message", "data"})
public class ErrorResponse<T> extends BaseResponse {
    private final int httpStatus;
    private final T data;

    @Builder
    private ErrorResponse(T data, BaseResponseCode baseResponseCode, String message) {
        super(false, baseResponseCode.getCode(), message);
        this.httpStatus = baseResponseCode.getHttpStatus().value();
        this.data = data;
    }

    public static ErrorResponse<?> from(BaseResponseCode baseResponseCode) {
        return new ErrorResponse<>(null, baseResponseCode, baseResponseCode.getMessage());
    }

    public static ErrorResponse<?> of(BaseResponseCode baseResponseCode, String message){
        return new ErrorResponse<>(null, baseResponseCode, message);
    }

    public static <T> ErrorResponse<T> of(T data, BaseResponseCode baseResponseCode, String message) {
        return new ErrorResponse<>(data, baseResponseCode, message);
    }
}
