package com.likelion.last.domain.vote.web.dto;

import java.util.List;

public record GetWinnersRes(
        int count,
        List<GetWinnerDetailRes> winners
) {
    public record GetWinnerDetailRes(
            String name
    ) {
        public static GetWinnerDetailRes from(String name) {
            return new GetWinnerDetailRes(
                    name
            );
        }
    }

    public static GetWinnersRes from(List<String> winnerNames) {
        return new GetWinnersRes(
                winnerNames.size(),
                winnerNames.stream().map(
                        GetWinnerDetailRes::from
                ).toList()
        );
    }
}
