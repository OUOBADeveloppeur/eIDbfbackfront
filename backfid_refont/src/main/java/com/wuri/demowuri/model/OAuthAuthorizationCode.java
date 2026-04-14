package com.wuri.demowuri.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Code d'autorisation temporaire (10 minutes) échangé contre un access token.
 * Généré après approbation du consentement par le citoyen.
 */
@Entity
@Table(name = "oauth_authorization_codes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuthAuthorizationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 200)
    private String code;

    @Column(name = "client_id", nullable = false, length = 100)
    private String clientId;

    @Column(name = "redirect_uri", nullable = false, length = 500)
    private String redirectUri;

    @Column(nullable = false, length = 300)
    private String scope;

    @Column(length = 200)
    private String state;

    /** PKCE — code_challenge (optionnel mais recommandé) */
    @Column(name = "code_challenge", length = 200)
    private String codeChallenge;

    @Column(name = "code_challenge_method", length = 10)
    private String codeChallengeMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personne_id", nullable = false)
    private Personne personne;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean used = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
