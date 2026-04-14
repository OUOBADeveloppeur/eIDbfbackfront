package com.wuri.demowuri.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Représente une plateforme gouvernementale enregistrée comme client OAuth.
 * Équivalent des "apps" dans Google OAuth Console.
 */
@Entity
@Table(name = "oauth_clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuthClient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Identifiant public du client (ex: "impots-bf", "cnss-bf") */
    @Column(name = "client_id", unique = true, nullable = false, length = 100)
    private String clientId;

    /** Secret BCrypt-encodé, utilisé pour l'échange de code → token */
    @Column(name = "client_secret", nullable = false)
    private String clientSecret;

    /** Nom affiché sur l'écran de consentement (ex: "Direction des Impôts") */
    @Column(nullable = false, length = 200)
    private String name;

    /** URL du logo affiché sur l'écran de consentement */
    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    /**
     * URIs de redirection autorisées, séparées par des virgules.
     * Ex: "https://impots.bf/callback,myapp://callback"
     */
    @Column(name = "redirect_uris", columnDefinition = "TEXT", nullable = false)
    private String redirectUris;

    /**
     * Scopes autorisés pour ce client, séparés par des espaces.
     * Ex: "openid profile phone national_id"
     */
    @Column(name = "allowed_scopes", length = 500)
    private String allowedScopes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean actif = true;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
