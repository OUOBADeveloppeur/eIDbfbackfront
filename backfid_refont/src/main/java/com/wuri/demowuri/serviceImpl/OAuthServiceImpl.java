package com.wuri.demowuri.serviceImpl;

import com.wuri.demowuri.dto.*;
import com.wuri.demowuri.model.*;
import com.wuri.demowuri.repository.*;
import com.wuri.demowuri.services.OAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class OAuthServiceImpl implements OAuthService {

    private final OAuthClientRepository clientRepository;
    private final OAuthAuthorizationCodeRepository codeRepository;
    private final OAuthAccessTokenRepository tokenRepository;
    private final PersonneRepository personneRepository;
    private final PasswordEncoder passwordEncoder;

    // Durée de vie du code d'autorisation : 10 minutes
    private static final int CODE_EXPIRY_MINUTES = 10;
    // Durée de vie de l'access token : 1 heure
    private static final int TOKEN_EXPIRY_HOURS = 1;

    @Override
    public OAuthClientInfoDto getClientInfo(String clientId) {
        OAuthClient client = clientRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("Client OAuth introuvable : " + clientId));

        if (!client.isActif()) {
            throw new RuntimeException("Client OAuth désactivé");
        }

        List<String> scopes = client.getAllowedScopes() != null
                ? Arrays.asList(client.getAllowedScopes().split(" "))
                : List.of("openid", "profile");

        return OAuthClientInfoDto.builder()
                .clientId(client.getClientId())
                .name(client.getName())
                .logoUrl(client.getLogoUrl())
                .description(client.getDescription())
                .allowedScopes(scopes)
                .build();
    }

    @Override
    public String approveConsent(OAuthConsentRequest request) {
        // Valider le client
        OAuthClient client = clientRepository.findByClientId(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client OAuth introuvable"));

        if (!client.isActif()) {
            throw new RuntimeException("Client OAuth désactivé");
        }

        // Valider le redirect_uri
        List<String> allowedUris = Arrays.asList(client.getRedirectUris().split(","));
        boolean uriAllowed = allowedUris.stream()
                .map(String::trim)
                .anyMatch(u -> u.equals(request.getRedirectUri()));
        if (!uriAllowed) {
            throw new RuntimeException("redirect_uri non autorisé");
        }

        // Charger la personne
        Personne personne = personneRepository.findByIu(request.getIu())
                .orElseThrow(() -> new RuntimeException("Citoyen introuvable"));

        // Générer un code d'autorisation unique
        String code = UUID.randomUUID().toString().replace("-", "") +
                      UUID.randomUUID().toString().replace("-", "");

        String scope = request.getApprovedScopes() != null
                ? String.join(" ", request.getApprovedScopes())
                : "openid profile";

        OAuthAuthorizationCode authCode = OAuthAuthorizationCode.builder()
                .code(code)
                .clientId(request.getClientId())
                .redirectUri(request.getRedirectUri())
                .scope(scope)
                .state(request.getState())
                .codeChallenge(request.getCodeChallenge())
                .codeChallengeMethod(request.getCodeChallengeMethod())
                .personne(personne)
                .expiresAt(LocalDateTime.now().plusMinutes(CODE_EXPIRY_MINUTES))
                .used(false)
                .build();

        codeRepository.save(authCode);
        return code;
    }

    @Override
    public String webAuthorize(OAuthWebAuthorizeRequest request) {
        // Valider le client
        OAuthClient client = clientRepository.findByClientId(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client OAuth introuvable"));
        if (!client.isActif()) throw new RuntimeException("Client désactivé");

        // Valider redirect_uri
        List<String> allowedUris = Arrays.asList(client.getRedirectUris().split(","));
        boolean uriOk = allowedUris.stream().map(String::trim)
                .anyMatch(u -> u.equals(request.getRedirectUri()));
        if (!uriOk) throw new RuntimeException("redirect_uri non autorisé");

        // Valider les credentials du citoyen directement
        Personne personne = personneRepository.findByIu(request.getIu())
                .orElseThrow(() -> new RuntimeException("Identifiant unique incorrect"));

        if (personne.getPassword() == null ||
                !passwordEncoder.matches(request.getPassword(), personne.getPassword())) {
            throw new RuntimeException("Identifiants incorrects");
        }

        // Générer le code
        String code = java.util.UUID.randomUUID().toString().replace("-", "") +
                      java.util.UUID.randomUUID().toString().replace("-", "");

        String scope = request.getApprovedScopes() != null && !request.getApprovedScopes().isEmpty()
                ? String.join(" ", request.getApprovedScopes())
                : (request.getScope() != null ? request.getScope() : "openid profile");

        OAuthAuthorizationCode authCode = OAuthAuthorizationCode.builder()
                .code(code)
                .clientId(request.getClientId())
                .redirectUri(request.getRedirectUri())
                .scope(scope)
                .state(request.getState())
                .codeChallenge(request.getCodeChallenge())
                .codeChallengeMethod(request.getCodeChallengeMethod())
                .personne(personne)
                .expiresAt(LocalDateTime.now().plusMinutes(CODE_EXPIRY_MINUTES))
                .used(false)
                .build();

        codeRepository.save(authCode);
        return code;
    }

    @Override
    public OAuthTokenResponse exchangeCode(OAuthTokenRequest request) {
        if (!"authorization_code".equals(request.getGrantType())) {
            throw new RuntimeException("grant_type non supporté");
        }

        // Valider le client et son secret
        OAuthClient client = clientRepository.findByClientId(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client inconnu"));

        if (!client.isActif()) {
            throw new RuntimeException("Client désactivé");
        }

        if (!passwordEncoder.matches(request.getClientSecret(), client.getClientSecret())) {
            throw new RuntimeException("client_secret invalide");
        }

        // Récupérer et valider le code
        OAuthAuthorizationCode authCode = codeRepository.findByCode(request.getCode())
                .orElseThrow(() -> new RuntimeException("Code d'autorisation invalide"));

        if (authCode.isUsed()) {
            throw new RuntimeException("Code déjà utilisé");
        }
        if (authCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Code expiré");
        }
        if (!authCode.getClientId().equals(request.getClientId())) {
            throw new RuntimeException("Code n'appartient pas à ce client");
        }
        if (!authCode.getRedirectUri().equals(request.getRedirectUri())) {
            throw new RuntimeException("redirect_uri ne correspond pas");
        }

        // Marquer le code comme utilisé
        authCode.setUsed(true);
        codeRepository.save(authCode);

        // Générer l'access token opaque
        String accessToken = UUID.randomUUID().toString().replace("-", "") +
                             UUID.randomUUID().toString().replace("-", "");

        LocalDateTime expiresAt = LocalDateTime.now().plusHours(TOKEN_EXPIRY_HOURS);

        OAuthAccessToken token = OAuthAccessToken.builder()
                .token(accessToken)
                .clientId(request.getClientId())
                .scope(authCode.getScope())
                .personne(authCode.getPersonne())
                .expiresAt(expiresAt)
                .build();

        tokenRepository.save(token);

        return OAuthTokenResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(TOKEN_EXPIRY_HOURS * 3600L)
                .scope(authCode.getScope())
                .build();
    }

    @Override
    public OAuthUserInfoDto getUserInfo(String accessToken) {
        OAuthAccessToken token = tokenRepository.findByToken(accessToken)
                .orElseThrow(() -> new RuntimeException("Token invalide"));

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expiré");
        }

        Personne p = token.getPersonne();
        List<String> scopes = Arrays.asList(token.getScope().split(" "));

        OAuthUserInfoDto.OAuthUserInfoDtoBuilder builder = OAuthUserInfoDto.builder()
                .sub(p.getIu());  // Toujours présent avec scope "openid"

        if (scopes.contains("profile")) {
            builder.givenName(p.getPrenom())
                   .familyName(p.getNom())
                   .name(p.getPrenom() + " " + p.getNom())
                   .gender(p.getSexe());
        }

        if (scopes.contains("birthdate")) {
            builder.birthdate(p.getDateNaissance() != null ? p.getDateNaissance().toString() : null)
                   .birthPlace(p.getLieuNaissance());
        }

        if (scopes.contains("phone") && p.getTelephone() != null) {
            builder.phoneNumber(p.getTelephone());
        }

        if (scopes.contains("national_id")) {
            builder.nationalId(p.getIu());
        }

        if (scopes.contains("picture") && p.getPhoto() != null) {
            builder.picture(p.getPhoto());
        }

        return builder.build();
    }
}
