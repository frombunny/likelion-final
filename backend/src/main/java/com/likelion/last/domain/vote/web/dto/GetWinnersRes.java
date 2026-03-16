package com.likelion.last.domain.vote.web.dto;

import com.likelion.last.domain.vote.entity.VoteWinner;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.web.util.UriUtils;

public record GetWinnersRes(
        int count,
        List<GetWinnerDetailRes> winners
) {
    public record GetWinnerDetailRes(
            String name,
            String imageUrl
    ) {
        public static GetWinnerDetailRes from(VoteWinner voteWinner) {
            String name = voteWinner.getName();
            return new GetWinnerDetailRes(
                    name,
                    "/winner/" + UriUtils.encodePathSegment(name, StandardCharsets.UTF_8) + ".png"
            );
        }
    }

    public static GetWinnersRes from(List<VoteWinner> winners) {
        return new GetWinnersRes(
                winners.size(),
                winners.stream().map(
                        GetWinnerDetailRes::from
                ).toList()
        );
    }
}
