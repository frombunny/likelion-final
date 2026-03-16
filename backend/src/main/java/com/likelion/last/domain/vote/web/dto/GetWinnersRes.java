package com.likelion.last.domain.vote.web.dto;

import com.likelion.last.domain.vote.entity.VoteWinner;
import com.likelion.last.domain.user.entity.User;
import java.util.List;
import java.util.Map;

public record GetWinnersRes(
        int count,
        List<GetWinnerDetailRes> winners
) {
    public record GetWinnerDetailRes(
            String name,
            String part,
            String imageUrl
    ) {
        public static GetWinnerDetailRes from(VoteWinner voteWinner, Map<String, User> usersByName) {
            String name = voteWinner.getName();
            User user = usersByName.get(name);
            return new GetWinnerDetailRes(
                    name,
                    user == null ? null : user.getPart().getEngTitle(),
                    null
            );
        }
    }

    public static GetWinnersRes from(
            List<VoteWinner> winners,
            Map<String, User> usersByName,
            Map<String, String> imageUrlsByName
    ) {
        return new GetWinnersRes(
                winners.size(),
                winners.stream().map(
                        winner -> {
                            GetWinnerDetailRes base = GetWinnerDetailRes.from(winner, usersByName);
                            return new GetWinnerDetailRes(
                                    base.name(),
                                    base.part(),
                                    imageUrlsByName.get(winner.getName())
                            );
                        }
                ).toList()
        );
    }
}
