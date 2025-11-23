package com.likelion.last.global.external.imageGeneration.exception;

import com.likelion.last.global.exception.BaseException;

public class FontNotLoadedException extends BaseException {
    public FontNotLoadedException(){
        super(ImageGenerationErrorCode.IMAGE_NOT_GENERATED_ERROR_500);
    }
}
