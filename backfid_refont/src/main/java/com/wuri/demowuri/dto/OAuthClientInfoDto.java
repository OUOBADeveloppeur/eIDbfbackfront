package com.wuri.demowuri.dto;

import lombok.*;

import java.util.List;

/** Infos du client affichées sur l'écran de consentement eIDbf */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuthClientInfoDto {
    private String clientId;
    private String name;
    private String logoUrl;
    private String description;
    private List<String> allowedScopes;
}
