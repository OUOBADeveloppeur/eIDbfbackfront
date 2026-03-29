package com.wuri.demowuri.serviceImpl;

import com.wuri.demowuri.dto.RoleDto;
import com.wuri.demowuri.model.Role;
import com.wuri.demowuri.repository.RoleRepository;
import com.wuri.demowuri.services.RoleService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository RoleRepository) {
        this.roleRepository = RoleRepository;
    }

    @Override
    public Role creerRole(Role Role) {
        return roleRepository.save(Role);
    }

    @Override
    public Role modifierRole(RoleDto roleDto, Long id) {
        Optional<Role> roleOp = roleRepository.findById(id);
        if (roleOp.isPresent()) {
            Role roleEx = roleOp.get();
            roleEx.setName(roleDto.getName());

            return roleRepository.save(roleEx);
        } else {
            return null;
        }
    }

    @Override
    public void deleteRole(Long id) {
        Optional<Role> roleOp = roleRepository.findById(id);
        if (roleOp.isPresent()) {
            Role roleEx = roleOp.get();
            roleRepository.delete(roleEx);
        }
    }

    @Override
    public Role showRole(Long id) {
        return roleRepository.findById(id).get();
    }

    @Override
    public List<Role> listeRole() {
        return roleRepository.findAll();
    }

}
