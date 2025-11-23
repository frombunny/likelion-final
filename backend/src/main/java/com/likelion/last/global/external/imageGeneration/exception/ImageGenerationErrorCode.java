package com.likelion.last.global.external.imageGeneration.exception;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

import com.likelion.last.global.response.code.BaseResponseCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ImageGenerationErrorCode implements BaseResponseCode {
    IMAGE_NOT_GENERATED_ERROR_500("FILE_CREATE_ERROR_500", INTERNAL_SERVER_ERROR, "수료증/상장 생성 중 에러가 발생했습니다."),
    FONT_NOT_LOADED_ERROR_500("FONT_LOAD_ERROR_500", INTERNAL_SERVER_ERROR, "폰트 로드 중 에러가 발생했습니다.");

    private final String code;
    private final HttpStatus httpStatus;
    private final String message;
}