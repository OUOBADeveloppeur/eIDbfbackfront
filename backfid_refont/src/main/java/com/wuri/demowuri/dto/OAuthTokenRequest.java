package com.wuri.demowuri.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/** Requête d'échange code → access token (côté plateforme gouvernementale) */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthTokenRequest {

    @JsonProperty("grant_type")
    private String grantType;      // "authorization_code"

    private String code;

    @JsonProperty("redirect_uri")
    private String redirectUri;

    @JsonProperty("client_id")
    private String clientId;

    @JsonProperty("client_secret")
    private String clientSecret;

    @JsonProperty("code_verifier")
    private String codeVerifier;   // PKCE
}
