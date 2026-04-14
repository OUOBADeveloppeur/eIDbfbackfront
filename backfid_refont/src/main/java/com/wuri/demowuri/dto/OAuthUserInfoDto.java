package com.wuri.demowuri.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * Profil OIDC retourné par /oauth/userinfo.
 * Seuls les champs couverts par les scopes approuvés sont inclus.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OAuthUserInfoDto {

    /** Identifiant unique du citoyen (IU) — toujours présent avec scope "openid" */
    private String sub;

    // scope: profile
    @JsonProperty("given_name")
    private String givenName;

    @JsonProperty("family_name")
    private String familyName;

    private String name;

    private String gender;

    // scope: birthdate
    @JsonProperty("birthdate")
    private String birthdate;

    @JsonProperty("birth_place")
    private String birthPlace;

    // scope: phone
    @JsonProperty("phone_number")
    private String phoneNumber;

    // scope: national_id
    @JsonProperty("national_id")
    private String nationalId;

    // scope: picture
    private String picture;
}
