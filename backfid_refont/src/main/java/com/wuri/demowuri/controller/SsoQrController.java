package com.wuri.demowuri.controller;

import com.wuri.demowuri.dto.SsoQrApproveRequest;
import com.wuri.demowuri.dto.SsoQrCreateRequest;
import com.wuri.demowuri.dto.SsoQrSessionDto;
import com.wuri.demowuri.services.SsoQrService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Flow SSO par QR Code — "Scanner avec eIDbf"
 *
 * 1. La plateforme appelle POST /create  → reçoit sessionId + qrContent + clientInfo + scopes
 * 2. La plateforme affiche le QR (image depuis GET /{sessionId}/image)
 *    et la liste des infos qui seront partagées
 * 3. Le citoyen scanne le QR avec l'app eIDbf (eServices > Authentification)
 * 4. L'app affiche la demande de consentement et demande la biométrie
 * 5. L'app appelle POST /{sessionId}/approve avec JWT du citoyen
 * 6. La plateforme, qui poll GET /{sessionId}/status, reçoit status=APPROVED + redirect_url
 * 7. La plateforme redirige vers redirect_url → échange le code → access token → userinfo
 */
@RestController
@RequestMapping("/api/v1/oauth/qr")
@RequiredArgsConstructor
public class SsoQrController {

    private final SsoQrService ssoQrService;

    /**
     * POST /api/v1/oauth/qr/create
     * PUBLIC — appelé par le plugin JS / la plateforme
     * Body: { client_id, client_secret, redirect_uri, scope, state }
     */
    @PostMapping("/create")
    public ResponseEntity<SsoQrSessionDto> createSession(@RequestBody SsoQrCreateRequest request) {
        try {
            SsoQrSessionDto dto = ssoQrService.createSession(request);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * GET /api/v1/oauth/qr/{sessionId}/status
     * PUBLIC — polling toutes les 2s par le plugin
     * Retourne: { status: "PENDING"|"APPROVED"|"DENIED"|"EXPIRED", redirect_url?, expires_in }
     */
    @GetMapping("/{sessionId}/status")
    public ResponseEntity<SsoQrSessionDto> getStatus(@PathVariable String sessionId) {
        try {
            return ResponseEntity.ok(ssoQrService.getStatus(sessionId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/v1/oauth/qr/{sessionId}/image
     * PUBLIC — retourne l'image PNG du QR code
     */
    @GetMapping(value = "/{sessionId}/image", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrImage(@PathVariable String sessionId) {
        try {
            byte[] image = ssoQrService.getQrImage(sessionId);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(image);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/v1/oauth/qr/{sessionId}/approve
     * REQUIRES JWT — appelé par l'app eIDbf après confirmation biométrique
     * Body: { session_id, iu, approved_scopes: ["openid","profile",...] }
     */
    @PostMapping("/{sessionId}/approve")
    public ResponseEntity<Map<String, String>> approve(
            @PathVariable String sessionId,
            @RequestBody SsoQrApproveRequest request) {
        try {
            request.setSessionId(sessionId);
            ssoQrService.approveSession(request);
            return ResponseEntity.ok(Map.of("status", "approved"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/v1/oauth/qr/{sessionId}/deny
     * REQUIRES JWT — appelé par l'app eIDbf si le citoyen refuse
     */
    @PostMapping("/{sessionId}/deny")
    public ResponseEntity<Map<String, String>> deny(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> body) {
        try {
            ssoQrService.denySession(sessionId, body.getOrDefault("iu", ""));
            return ResponseEntity.ok(Map.of("status", "denied"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
