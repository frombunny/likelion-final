package com.likelion.last.global.external.imageGeneration.exception;

import com.likelion.last.global.exception.BaseException;

public class FileNotCreatedException extends BaseException {
    public FileNotCreatedException() {
        super(ImageGenerationErrorCode.IMAGE_NOT_GENERATED_ERROR_500);
    }
}
