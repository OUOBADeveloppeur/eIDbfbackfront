package com.wuri.demowuri.serviceImpl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.wuri.demowuri.dto.UserDto;
import com.wuri.demowuri.mapper.UserMapper;
import com.wuri.demowuri.model.Role;
import com.wuri.demowuri.model.User;
import com.wuri.demowuri.repository.RoleRepository;
import com.wuri.demowuri.repository.UserRepository;
import com.wuri.demowuri.services.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;


     @Autowired
    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository=roleRepository;
    }

    @Override
    public User creerUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User modifierUser(UserDto userDto, Long id) {

        User userEx = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // 🔹 Mise à jour des infos de base
        userEx.setUsername(userDto.getUsername());
        userEx.setNom(userDto.getNom());
        userEx.setPrenom(userDto.getPrenom());
        userEx.setTelephone(userDto.getTelephone());

        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
          userEx.setPassword(passwordEncoder.encode(userDto.getPassword()));
}


        // 🔹 Mise à jour du rôle
        if (userDto.getRoleid() != null) {

            Role role = roleRepository.findById(userDto.getRoleid())
                    .orElseThrow(() -> new RuntimeException("Rôle introuvable"));

            // ⚠️ ManyToMany → on remplace les rôles
            userEx.getRoles().clear();
            userEx.getRoles().add(role);
        }

        return userRepository.save(userEx);
    }

      @Override
    public User modifierUserPassword(UserDto userDto, Long id) {

        User userEx = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        userEx.setPassword(passwordEncoder.encode(userDto.getPassword()));
        return userRepository.save(userEx);
    }

    @Override
    public void deleteUser(Long id) {
        Optional<User> userOp = userRepository.findById(id);
        if (userOp.isPresent()) {
            User userEx = userOp.get();
            userRepository.delete(userEx);
        }
    }

    @Override
    public User showUser(Long id) {
        return userRepository.findById(id).get();
    }

    @Override
    public List<UserDto> listeUser() {
        List<String> exclus = List.of("remote", "aristide");

        List<UserDto> users = userRepository.findAll()
                .stream()
                .filter(user -> !exclus.contains(user.getUsername()))
                .map(UserMapper::toDto)
                .collect(Collectors.toList());

        return users;
    }

}
