package com.likelion.last.domain.user.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Part {
    PRODUCT_MANAGER("기획", "Product Manger"),
    DESIGNER("디자인", "Designer"),
    FRONTEND_DEVELOPER("프론트엔드", "Frontend Developer"),
    BACKEND_DEVELOPER("백엔드", "Backend Developer");

    private final String korTitle;
    private final String engTitle;
}
