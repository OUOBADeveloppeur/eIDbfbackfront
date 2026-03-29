package com.wuri.demowuri.controller;

import com.wuri.demowuri.dto.RoleDto;
import com.wuri.demowuri.model.Role;

import com.wuri.demowuri.services.RoleService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("api/v1/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("creer")
    public ResponseEntity<Role> creerRole(@RequestBody Role role) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roleService.creerRole(role));
    }

    @PutMapping("update/{id}")
    public ResponseEntity<Role> updateRole(@RequestBody RoleDto roleDto, @PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(roleService.modifierRole(roleDto, id));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("liste")
    public ResponseEntity<List<Role>> listeRole() {
        return ResponseEntity.status(HttpStatus.OK).body(roleService.listeRole());
    }

    @GetMapping("show/{id}")
    public ResponseEntity<Role> showCategorie(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(roleService.showRole(id));
    }
}
