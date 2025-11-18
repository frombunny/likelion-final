package com.likelion.last.global.response;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.likelion.last.global.response.code.BaseResponseCode;
import com.likelion.last.global.response.code.GlobalSuccessResponseCode;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@JsonPropertyOrder({"isSuccess", "timestamp", "httpStatus", "message", "data"})
public class SuccessResponse<T> extends BaseResponse {
    private final int httpStatus;
    private final T data;

    @Builder
    private SuccessResponse(T data, BaseResponseCode baseResponseCode) {
        super(true, baseResponseCode.getCode(), baseResponseCode.getMessage());
        this.data = data;
        this.httpStatus = baseResponseCode.getHttpStatus().value();
    }

    public static <T> SuccessResponse<T> from(T data) {
        return new SuccessResponse<T>(data, GlobalSuccessResponseCode.SUCCESS_OK);
    }

    public static <T> SuccessResponse<T> of(T data, BaseResponseCode baseResponseCode) {
        return new SuccessResponse<T>(data, baseResponseCode);
    }

    public static <T> SuccessResponse<T> empty() {
        return new SuccessResponse<>(null, GlobalSuccessResponseCode.SUCCESS_OK);
    }
}
