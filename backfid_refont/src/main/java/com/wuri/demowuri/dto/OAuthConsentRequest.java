package com.wuri.demowuri.dto;

import lombok.*;

import java.util.List;

/** Requête envoyée par l'app eIDbf après approbation biométrique du citoyen */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthConsentRequest {
    private String iu;
    private String clientId;
    private String redirectUri;
    private List<String> approvedScopes;
    private String state;
    private String codeChallenge;
    private String codeChallengeMethod;
}
