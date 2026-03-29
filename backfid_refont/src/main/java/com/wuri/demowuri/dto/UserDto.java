package com.wuri.demowuri.dto;

import lombok.Data;

@Data
public class UserDto {

    private String username;
    private Long id;
    private String password;
    private String nom;

    private String prenom;

    private String telephone;

    private String role;
    private Long roleid;

}
