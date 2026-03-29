package com.wuri.demowuri.dto;

import com.wuri.demowuri.model.User;

import lombok.Data;

@Data
public class RoleDto {

  private String name;
  private Long id;
  private User user;

}
