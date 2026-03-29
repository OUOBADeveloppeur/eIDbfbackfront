package com.wuri.demowuri.mapper;

import com.wuri.demowuri.dto.UserDto;
import com.wuri.demowuri.model.Role;
import com.wuri.demowuri.model.User;

public class UserMapper {

    public static UserDto toDto(User user) {
        if (user == null) return null;

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setNom(user.getNom());
        dto.setPrenom(user.getPrenom());
        dto.setTelephone(user.getTelephone());
        // ⚠️ généralement on ne renvoie PAS le password
        // dto.setPassword(user.getPassword());

        // 🔹 Récupération du premier rôle
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            Role role = user.getRoles().iterator().next(); // premier rôle
            dto.setRoleid(role.getId());
            dto.setRole(role.getName());
        }

        return dto;
    }
}

