package com.wuri.demowuri.controller;

import com.wuri.demowuri.dto.OAuthClientInfoDto;
import com.wuri.demowuri.dto.OAuthClientRegisterRequest;
import com.wuri.demowuri.model.OAuthClient;
import com.wuri.demowuri.repository.OAuthClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Gestion des clients OAuth (plateformes gouvernementales partenaires).
 * Accès ADMIN uniquement.
 */
@RestController
@RequestMapping("/api/v1/oauth/admin/clients")
@RequiredArgsConstructor
public class OAuthAdminController {

    private final OAuthClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    /** Enregistrer une nouvelle plateforme gouvernementale */
    @PostMapping
    public ResponseEntity<?> registerClient(@RequestBody OAuthClientRegisterRequest request) {
        if (clientRepository.existsByClientId(request.getClientId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Ce client_id existe déjà : " + request.getClientId()));
        }

        OAuthClient client = OAuthClient.builder()
                .clientId(request.getClientId())
                .clientSecret(passwordEncoder.encode(request.getClientSecret()))
                .name(request.getName())
                .logoUrl(request.getLogoUrl())
                .description(request.getDescription())
                .redirectUris(request.getRedirectUris())
                .allowedScopes(request.getAllowedScopes() != null
                        ? request.getAllowedScopes()
                        : "openid profile")
                .actif(true)
                .build();

        clientRepository.save(client);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Client enregistré avec succès",
                "client_id", client.getClientId(),
                "name", client.getName()
        ));
    }

    /** Lister tous les clients enregistrés */
    @GetMapping
    public ResponseEntity<List<OAuthClientInfoDto>> listClients() {
        List<OAuthClientInfoDto> clients = clientRepository.findAll().stream()
                .map(c -> OAuthClientInfoDto.builder()
                        .clientId(c.getClientId())
                        .name(c.getName())
                        .logoUrl(c.getLogoUrl())
                        .description(c.getDescription())
                        .allowedScopes(c.getAllowedScopes() != null
                                ? Arrays.asList(c.getAllowedScopes().split(" "))
                                : List.of())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(clients);
    }

    /** Activer / désactiver un client */
    @PutMapping("/{clientId}/toggle")
    public ResponseEntity<?> toggleClient(@PathVariable String clientId) {
        OAuthClient client = clientRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));
        client.setActif(!client.isActif());
        clientRepository.save(client);
        return ResponseEntity.ok(Map.of(
                "client_id", clientId,
                "actif", client.isActif()
        ));
    }

    /** Supprimer un client */
    @DeleteMapping("/{clientId}")
    public ResponseEntity<?> deleteClient(@PathVariable String clientId) {
        OAuthClient client = clientRepository.findByClientId(clientId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));
        clientRepository.delete(client);
        return ResponseEntity.ok(Map.of("message", "Client supprimé"));
    }
}
