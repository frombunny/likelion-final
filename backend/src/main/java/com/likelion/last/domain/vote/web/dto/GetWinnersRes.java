package com.likelion.last.domain.vote.web.dto;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.entity.enums.Part;
import java.util.List;

public record GetWinnersRes(
        int count,
        List<GetWinnerDetailRes> winners
) {
    public record GetWinnerDetailRes(
            String name,
            Part part,
            String profileImageUrl
    ) {
        public static GetWinnerDetailRes from(User user) {
            return new GetWinnerDetailRes(
                    user.getName(),
                    user.getPart(),
                    user.getProfileImageUrl()
            );
        }
    }

    public static GetWinnersRes from(List<User> users) {
        return new GetWinnersRes(
                users.size(),
                users.stream().map(
                        GetWinnerDetailRes::from
                ).toList()
        );
    }
}
