package com.likelion.last.domain.user.web.dto;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.entity.enums.Part;
import java.util.List;

public record GetAllUserRes(
        int count,
        List<GetOneUserRes> users
) {
    public record GetOneUserRes(
            Long id,
            String name,
            Part part,
            String profileImageUrl
    ) {

        public static GetOneUserRes from(User user) {
            return new GetOneUserRes(
                    user.getId(),
                    user.getName(),
                    user.getPart(),
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
