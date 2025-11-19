package com.likelion.last.domain.vote.entity.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Award {
    VITALITY_AWARD("너없인 의미 없는 세상"),
    KINDNESS_AWARD("다정함이 상상 그 이상"),
    CONTRIBUTION_AWARD("수고했어 항상"),
    EXCELLENCE_AWARD("실력이 압도적 환상"),
    GROWTH_AWARD("하늘 찔러 위상");

    private final String name;
}
