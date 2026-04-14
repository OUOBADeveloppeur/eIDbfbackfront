package com.wuri.demowuri.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

/**
 * Réponse de création + polling d'une session SSO QR.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SsoQrSessionDto {

    @JsonProperty("session_id")
    private String sessionId;

    /** Contenu à encoder dans le QR : "eidbf://oauth/qr?session=..." */
    @JsonProperty("qr_content")
    private String qrContent;

    /** PENDING | APPROVED | DENIED | EXPIRED */
    private String status;

    /** URL de callback avec code (quand status = APPROVED) */
    @JsonProperty("redirect_url")
    private String redirectUrl;

    /** Secondes avant expiration */
    @JsonProperty("expires_in")
    private Long expiresIn;

    /** Infos sur le client (pour affichage dans l'app) */
    @JsonProperty("client_info")
    private ClientInfo clientInfo;

    /** Scopes demandés avec labels (pour affichage dans l'app) */
    private List<ScopeInfo> scopes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ClientInfo {
        private String name;
        private String description;
        @JsonProperty("logo_url")
        private String logoUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ScopeInfo {
        private String scope;
        private String label;
        private String description;
        private boolean required;
    }
}
