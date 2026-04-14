package com.wuri.demowuri.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Access token opaque (UUID) délivré à la plateforme gouvernementale.
 * Utilisé pour appeler /oauth/userinfo et récupérer le profil du citoyen.
 */
@Entity
@Table(name = "oauth_access_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuthAccessToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, columnDefinition = "TEXT")
    private String token;

    @Column(name = "client_id", nullable = false, length = 100)
    private String clientId;

    @Column(nullable = false, length = 300)
    private String scope;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personne_id", nullable = false)
    private Personne personne;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
