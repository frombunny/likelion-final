package com.likelion.last.domain.document.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum DocumentType {
    CERTIFICATION("수료증"),
    AWARD("상장");

    private final String name;
}
