package com.likelion.last.global.external.imageGeneration.exception;

import com.likelion.last.global.exception.BaseException;

public class ImageGenerationDisabledException extends BaseException {
    public ImageGenerationDisabledException() {
        super(ImageGenerationErrorCode.IMAGE_GENERATION_DISABLED_503);
    }
}
