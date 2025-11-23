package com.likelion.last.domain.user.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    ROLE_LEADER("대표", "Leader"),
    ROLE_SUB_LEADER("부대표", "Sub Leader"),
    ROLE_PART_LEADER("팀장", "Part Leader"),
    ROLE_EXECUTIVE("운영진", "Executive"),
    ROLE_BABY_LION("아기사자", "BaBy Lion");

    private final String korTitle;
    private final String engTitle;

    public String getPureName() {
        return this.name().replace("ROLE_", "");
    }
}
