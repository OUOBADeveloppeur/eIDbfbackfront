package com.wuri.demowuri.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.wuri.demowuri.dto.UserDto;
import com.wuri.demowuri.model.User;
import com.wuri.demowuri.services.UserService;

@Controller
@RequestMapping("api/v1/users")
public class UserController {

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("creer")
    public ResponseEntity<User> creerUser(@RequestBody User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return ResponseEntity.status(HttpStatus.CREATED).body(userService.creerUser(user));
    }

    @PutMapping("update/{id}")
    public ResponseEntity<User> updateUser(@RequestBody UserDto UserDto, @PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.modifierUser(UserDto, id));
    }

      @PutMapping("update/password/{id}")
    public ResponseEntity<User> updateUserPassword(@RequestBody UserDto UserDto, @PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.modifierUserPassword(UserDto, id));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("liste")
    public ResponseEntity<List<UserDto>> listeUser() {
        return ResponseEntity.status(HttpStatus.OK).body(userService.listeUser());
    }

    @GetMapping("show/{id}")
    public ResponseEntity<User> showCategorie(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.showUser(id));
    }
}
