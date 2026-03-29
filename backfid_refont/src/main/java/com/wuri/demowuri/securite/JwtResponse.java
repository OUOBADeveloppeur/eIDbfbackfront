package com.wuri.demowuri.securite;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class JwtResponse {
  private String token;
  private String type;
  private Collection<? extends GrantedAuthority> authorities;
  private String username;
  private Long userId;

  public JwtResponse(String token, String type, Collection<? extends GrantedAuthority> authorities, String username, Long userId) {
    this.token = token;
    this.type = type;
    this.authorities = authorities;
    this.username = username;
    this.userId = userId;
  }

  public String getToken() {
    return token;
  }
  public void setToken(String token) {
    this.token = token;
  }
  public String getType() {
    return type;
  }
  public void setType(String type) {
    this.type = type;
  }


   public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }
  public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
    this.authorities = authorities;
  }

  public String getUsername() {
    return username;
  }
  public void setUsername(String username) {
    this.username = username;
  }

  public Long getUserId() {
    return userId;
  }
  public void setUserId(Long userId) {
    this.userId = userId;
  }

}
