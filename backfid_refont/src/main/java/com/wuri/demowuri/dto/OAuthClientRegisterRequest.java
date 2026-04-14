package com.wuri.demowuri.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * Requête d'enregistrement d'une nouvelle plateforme gouvernementale
 * comme client OAuth (endpoint ADMIN).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthClientRegisterRequest {

    @JsonProperty("client_id")
    private String clientId;

    /** Secret en clair — sera BCrypt-encodé avant stockage */
    @JsonProperty("client_secret")
    private String clientSecret;

    private String name;

    @JsonProperty("logo_url")
    private String logoUrl;

    private String description;

    /**
     * URIs de redirection autorisées, séparées par des virgules.
     * Ex: "https://impots.bf/callback,http://localhost:4200/callback"
     */
    @JsonProperty("redirect_uris")
    private String redirectUris;

    /**
     * Scopes autorisés, séparés par des espaces.
     * Ex: "openid profile phone birthdate national_id"
     */
    @JsonProperty("allowed_scopes")
    private String allowedScopes;
}
