package com.wuri.demowuri.securite;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${jwt.secret}")
  private String jwtSecretString;

  private final int jwtExpirationMs = 86400000;  // 1 jour in milliseconds

  private Key getSigningKey() {
    if (jwtSecretString == null || jwtSecretString.isEmpty()) {
      return Keys.secretKeyFor(SignatureAlgorithm.HS512);
    }

    // Ensure the key is at least 512 bits
    byte[] keyBytes = jwtSecretString.getBytes();
    if (keyBytes.length * 8 < 512) {
      return Keys.hmacShaKeyFor(jwtSecretString.getBytes());
    }
    return Keys.hmacShaKeyFor(jwtSecretString.getBytes());
  }

  private Date generateExpirationDate() {
    return new Date(System.currentTimeMillis() + jwtExpirationMs);
  }

  public String generateJwtToken(Authentication authentication) {
    // recuperation du nom de l'utilisateur
    UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

    // construiction du JWT Token (les different propriété)
    return Jwts.builder()
      .setSubject(userPrincipal.getUsername())
      .setIssuedAt(new Date())
      .setExpiration(generateExpirationDate())
      .signWith(getSigningKey(), SignatureAlgorithm.HS512)
      .compact();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token);
      return true;
    } catch (SignatureException e) {
      logger.error("JWT signature error: {}", e.getMessage());
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("Unsupported JWT: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("Empty JWT: {}", e.getMessage());
    }
    return false;
  }
public boolean validateToken2(String token) {
    try {
        Jwts.parserBuilder().setSigningKey(jwtSecretString).build().parseClaimsJws(token);
        return true;
    } catch (Exception ex) {
        System.out.println("Erreur JWT : " + ex.getMessage());  // 🧨 AJOUTE ÇA
        return false;
    }
}

  // Extracts the username from the JWT
  public String getUsernameFromJWT(String token) {
    try {
      return Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
    } catch (JwtException e) {
      logger.error("Error extracting username from JWT: {}", e.getMessage());
      return null;
    }
  }
}
