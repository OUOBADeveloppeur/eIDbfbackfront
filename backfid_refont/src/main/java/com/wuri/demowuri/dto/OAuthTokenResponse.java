package com.wuri.demowuri.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/** Réponse standard OAuth 2.0 après échange du code */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuthTokenResponse {

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("token_type")
    @Builder.Default
    private String tokenType = "Bearer";

    @JsonProperty("expires_in")
    private long expiresIn;   // en secondes

    private String scope;
}
