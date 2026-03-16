package com.likelion.last.domain.user.web.dto;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.entity.enums.Part;
import com.likelion.last.domain.user.entity.enums.Role;

public record GetMeRes(
        Long id,
        String name,
        Part part,
        Role role,
        String profileImageUrl
) {
    public static GetMeRes from(User user) {
        return new GetMeRes(
                user.getId(),
                user.getName(),
                user.getPart(),
                user.getRole(),
                user.getProfileImageUrl()
        );
    }
}
