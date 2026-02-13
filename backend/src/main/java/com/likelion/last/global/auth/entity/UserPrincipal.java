package com.likelion.last.global.auth.entity;

import com.likelion.last.domain.user.entity.User;
import com.likelion.last.domain.user.entity.enums.Role;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter
public class UserPrincipal implements UserDetails {
    private final Long id;
    private final Long kakaoId;
    private final String name;
    private final Role role;
    private final String profileImageUrl;

    public UserPrincipal(User user) {
        this.id = user.getId();
        this.kakaoId = user.getKakaoId();
        this.role = user.getRole();
        this.name = user.getName();
        this.profileImageUrl = user.getProfileImageUrl();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.toString()));
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return id.toString();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
