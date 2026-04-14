package com.wuri.demowuri.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

/**
 * Requête soumise par la page web de consentement eIDbf.
 * Valide les credentials + crée le code d'autorisation en une seule étape.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthWebAuthorizeRequest {

    /** Identifiant Unique du citoyen */
    private String iu;

    private String password;

    @JsonProperty("client_id")
    private String clientId;

    @JsonProperty("redirect_uri")
    private String redirectUri;

    private String scope;

    private String state;

    @JsonProperty("approved_scopes")
    private List<String> approvedScopes;

    @JsonProperty("code_challenge")
    private String codeChallenge;

    @JsonProperty("code_challenge_method")
    private String codeChallengeMethod;
}
