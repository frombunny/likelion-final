package com.likelion.last.domain.user.web.dto;

import com.likelion.last.domain.user.entity.User;
import java.util.List;

public record GetAllUserRes(
        int count,
        List<GetOneUserRes> users
) {
    public record GetOneUserRes(
            Long id,
            String name,
            String profileImageUrl
    ) {

        public static GetOneUserRes from(User user) {
            return new GetOneUserRes(
                    user.getId(),
                    user.getName(),
                    user.getProfileImageUrl()
            );
        }
    }

    public static GetAllUserRes from(List<User> users) {
        return new GetAllUserRes(
                users.size(),
                users.stream().map(
                        GetOneUserRes::from
                ).toList()
        );
    }
}
