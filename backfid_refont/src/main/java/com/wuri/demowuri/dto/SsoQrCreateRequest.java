package com.wuri.demowuri.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/** Requête de création d'une session SSO QR par la plateforme gouvernementale */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SsoQrCreateRequest {

    @JsonProperty("client_id")
    private String clientId;

    @JsonProperty("client_secret")
    private String clientSecret;

    @JsonProperty("redirect_uri")
    private String redirectUri;

    private String scope;    // ex: "openid profile"

    private String state;    // valeur anti-CSRF générée par le client
}
