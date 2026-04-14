package com.wuri.demowuri.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

/** Requête envoyée par l'app eIDbf pour approuver une session QR SSO */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SsoQrApproveRequest {

    @JsonProperty("session_id")
    private String sessionId;

    /** IU du citoyen connecté sur eIDbf */
    private String iu;

    /** Scopes que le citoyen accepte de partager */
    @JsonProperty("approved_scopes")
    private List<String> approvedScopes;
}
