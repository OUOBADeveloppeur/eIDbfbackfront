
package com.wuri.demowuri.services;

import com.wuri.demowuri.dto.RoleDto;
import com.wuri.demowuri.model.Role;

import java.util.List;

public interface RoleService {

    Role creerRole(Role role);

    Role modifierRole(RoleDto roleDto, Long id);

    void deleteRole(Long id);

    Role showRole(Long id);

    List<Role> listeRole();
}
