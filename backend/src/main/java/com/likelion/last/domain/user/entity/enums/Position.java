package com.likelion.last.domain.user.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Position {
    LEADER("대표"),
    VICE_LEADER("부대표"),
    PART_LEADER("팀장"),
    EXECUTIVE("운영진"),
    BABY_LION("아기사자");

    private final String name;
}
