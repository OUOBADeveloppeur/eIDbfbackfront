package com.wuri.demowuri.securite;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;

@Service
public class QrJwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.qr.expiration.minutes}")
    private int expirationMinutes;

    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateQrToken(Map<String, Object> claims) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiration = now.plusMinutes(expirationMinutes);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(Date.from(now.atZone(ZoneId.systemDefault()).toInstant()))
                .setExpiration(Date.from(expiration.atZone(ZoneId.systemDefault()).toInstant()))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

