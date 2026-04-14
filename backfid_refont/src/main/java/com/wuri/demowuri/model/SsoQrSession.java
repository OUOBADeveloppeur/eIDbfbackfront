package com.wuri.demowuri.model;

import com.wuri.demowuri.enums.SsoQrStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Session SSO par QR Code.
 *
 * Flow :
 *  1. La plateforme gov crée une session → reçoit sessionId + contenu QR
 *  2. Le citoyen scanne le QR avec eIDbf → approuve → statut passe à APPROVED
 *  3. La plateforme poll /sso/qr/status/{sessionId} → reçoit le code d'autorisation
 *  4. La plateforme échange le code → access token → userinfo
 */
@Entity
@Table(name = "sso_qr_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SsoQrSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", unique = true, nullable = false, length = 100)
    private String sessionId;

    @Column(name = "client_id", nullable = false, length = 100)
    private String clientId;

    @Column(name = "redirect_uri", length = 500)
    private String redirectUri;

    @Column(length = 300)
    private String scope;

    @Column(length = 200)
    private String state;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SsoQrStatus status = SsoQrStatus.PENDING;

    /** Code d'autorisation généré après approbation */
    @Column(name = "auth_code", length = 200)
    private String authCode;

    /** Scopes approuvés par le citoyen (espace-séparés), définis à l'approbation */
    @Column(name = "approved_scopes", length = 300)
    private String approvedScopes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personne_id")
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
