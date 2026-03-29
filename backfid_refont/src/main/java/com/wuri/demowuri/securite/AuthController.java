package com.wuri.demowuri.securite;
import com.wuri.demowuri.model.User;
import com.wuri.demowuri.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController("securityAuthController")
@RequestMapping("/api/v1/auth")
public class AuthController {

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private JwtUtils jwtUtils;

  @Autowired
  private UserRepository userRepository;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
    );

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);

    User user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
    String username = user != null ? user.getUsername() : loginRequest.getUsername();
    Long userId = user != null ? user.getId() : null;

    return ResponseEntity.ok(new JwtResponse(jwt, "Bearer", authentication.getAuthorities(), username, userId));
  }

  
}
