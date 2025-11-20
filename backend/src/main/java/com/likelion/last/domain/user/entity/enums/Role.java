package com.likelion.last.domain.user.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    ROLE_LEADER("대표"),
    ROLE_SUB_LEADER("부대표"),
    ROLE_PART_LEADER("팀장"),
    ROLE_EXECUTIVE("운영진"),
    ROLE_BABY_LION("아기사자");

    private final String name;
}
