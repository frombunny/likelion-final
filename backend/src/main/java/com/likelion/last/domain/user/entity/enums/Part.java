package com.likelion.last.domain.user.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Part {
    PLAN("기획"),
    DESIGN("디자인"),
    FRONTEND("프론트엔드"),
    BACKEND("백엔드");

    private final String name;
}
