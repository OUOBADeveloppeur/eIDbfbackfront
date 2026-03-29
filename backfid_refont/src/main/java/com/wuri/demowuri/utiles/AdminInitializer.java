package com.wuri.demowuri.utiles;

import java.util.Collections;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.wuri.demowuri.model.Role;
import com.wuri.demowuri.model.User;
import com.wuri.demowuri.repository.RoleRepository;
import com.wuri.demowuri.repository.UserRepository;

@Configuration
public class AdminInitializer {

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository,
                                       RoleRepository roleRepository,
                                       PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Vérifie si le rôle ROLE_ADMIN existe
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("ADMIN");
                        return roleRepository.save(role);
                    });

            Role userRole = roleRepository.findByName("USER")
            .orElseGet(() -> {
                Role role = new Role();
                role.setName("USER");
                return roleRepository.save(role);
            });

            // 2. Vérifie si l'utilisateur admin existe
            if (!userRepository.existsByUsername("remote")) {
                User admin = new User();
                admin.setUsername("remote");
                admin.setPassword(passwordEncoder.encode("remote1234"));
                admin.setRoles(Collections.singleton(userRole));
                userRepository.save(admin);
                System.out.println("Utilisateur remote créé : remote / remote1234");
            } else {
                System.out.println("L'utilisateur remote existe déjà.");
            }

              if (!userRepository.existsByUsername("admin")) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setRoles(Collections.singleton(adminRole));
                userRepository.save(admin);
                System.out.println("Utilisateur admin créé : admin / admin123");
            } else {
                System.out.println("L'utilisateur admin existe déjà.");
            }

             if (!userRepository.existsByUsername("aristide")) {
                User admin = new User();
                admin.setUsername("aristide");
                admin.setPassword(passwordEncoder.encode("aristide123"));
                admin.setRoles(Collections.singleton(adminRole));
                userRepository.save(admin);
                System.out.println("Utilisateur aristide créé : aristide / aristide123");
            } else {
                System.out.println("L'utilisateur aristide existe déjà.");
            }
        };
    }
}
