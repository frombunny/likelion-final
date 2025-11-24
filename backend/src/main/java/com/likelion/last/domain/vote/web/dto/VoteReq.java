package com.likelion.last.domain.vote.web.dto;

import com.likelion.last.domain.vote.entity.enums.Sector;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record VoteReq(
        @NotEmpty(message = "투표는 필수 값입니다.")
        List<VoteItem> voteItems
) {
    public record VoteItem(
            @NotNull(message = "부문은 필수 값입니다.") Sector sector,

            @NotEmpty(message = "최소 1명을 투표해야 합니다.")
            @Size(max = 2, message = "최대 2명까지 투표 가능합니다.")
            List<Long> users
    ) {
    }
}
