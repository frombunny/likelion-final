package com.likelion.last.domain.user.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Part {
    PM("기획", "Product Manger"),
    DE("디자인", "Designer"),
    FE("프론트엔드", "Frontend Developer"),
    BE("백엔드", "Backend Developer");

    private final String korTitle;
    private final String engTitle;
}
