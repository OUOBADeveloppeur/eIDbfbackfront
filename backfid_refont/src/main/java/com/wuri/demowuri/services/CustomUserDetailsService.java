package com.wuri.demowuri.services;
import com.wuri.demowuri.model.Role;
import com.wuri.demowuri.model.User;
import com.wuri.demowuri.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
      .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec le nom : " + username));
    return new org.springframework.security.core.userdetails.User(
      user.getUsername(), user.getPassword(), getAuthorities(user)
    );
  }

  private Collection<? extends GrantedAuthority> getAuthorities(User user) {
    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
    for (Role role : user.getRoles()) {
      authorities.add(new SimpleGrantedAuthority("ROLE_" +role.getName()));
    }
    return authorities;
  }
}
