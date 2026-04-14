package com.wuri.demowuri.serviceImpl;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.wuri.demowuri.dto.SsoQrApproveRequest;
import com.wuri.demowuri.dto.SsoQrCreateRequest;
import com.wuri.demowuri.dto.SsoQrSessionDto;
import com.wuri.demowuri.enums.SsoQrStatus;
import com.wuri.demowuri.model.*;
import com.wuri.demowuri.repository.*;
import com.wuri.demowuri.services.SsoQrService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Transactional
@RequiredArgsConstructor
public class SsoQrServiceImpl implements SsoQrService {

    private final SsoQrSessionRepository sessionRepository;
    private final OAuthClientRepository clientRepository;
    private final OAuthAuthorizationCodeRepository codeRepository;
    private final PersonneRepository personneRepository;
    private final PasswordEncoder passwordEncoder;

    private static final int SESSION_EXPIRY_MINUTES = 5;
    private static final int CODE_EXPIRY_MINUTES = 10;

    // Labels lisibles pour chaque scope
    private static final Map<String, SsoQrSessionDto.ScopeInfo> SCOPE_INFO;
    static {
        SCOPE_INFO = new LinkedHashMap<>();
        SCOPE_INFO.put("openid",     new SsoQrSessionDto.ScopeInfo("openid",     "Authentification",           "Confirme votre identite sans exposer de donnees",       true));
        SCOPE_INFO.put("profile",    new SsoQrSessionDto.ScopeInfo("profile",    "Nom et prenom",              "Votre nom complet tel qu'il figure sur votre CNIB",     false));
        SCOPE_INFO.put("birthdate",  new SsoQrSessionDto.ScopeInfo("birthdate",  "Date et lieu de naissance",  "Votre date et lieu de naissance officiels",             false));
        SCOPE_INFO.put("phone",      new SsoQrSessionDto.ScopeInfo("phone",      "Numero de telephone",        "Votre numero de telephone enregistre",                  false));
        SCOPE_INFO.put("national_id",new SsoQrSessionDto.ScopeInfo("national_id","Identifiant unique (IU)",    "Votre numero d'identifiant national unique",            false));
        SCOPE_INFO.put("picture",    new SsoQrSessionDto.ScopeInfo("picture",    "Photo d'identite",           "Votre photo officielle d'identite",                     false));
    }

    @Override
    public SsoQrSessionDto createSession(SsoQrCreateRequest request) {
        OAuthClient client = clientRepository.findByClientId(request.getClientId())
                .orElseThrow(() -> new RuntimeException("Client OAuth inconnu"));

        if (!client.isActif()) throw new RuntimeException("Client desactive");

        if (!passwordEncoder.matches(request.getClientSecret(), client.getClientSecret())) {
            throw new RuntimeException("client_secret invalide");
        }

        if (request.getRedirectUri() != null) {
            List<String> allowedUris = Arrays.asList(client.getRedirectUris().split(","));
            boolean ok = allowedUris.stream().map(String::trim)
                    .anyMatch(u -> u.equals(request.getRedirectUri()));
            if (!ok) throw new RuntimeException("redirect_uri non autorise");
        }

        String sessionId = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(SESSION_EXPIRY_MINUTES);
        String scopeStr = request.getScope() != null ? request.getScope() : "openid profile";

        SsoQrSession session = SsoQrSession.builder()
                .sessionId(sessionId)
                .clientId(request.getClientId())
                .redirectUri(request.getRedirectUri())
                .scope(scopeStr)
                .state(request.getState())
                .status(SsoQrStatus.PENDING)
                .expiresAt(expiresAt)
                .build();
        sessionRepository.save(session);

        // Deep link scanné par l'app eIDbf
        String qrContent = "eidbf://oauth/qr?session=" + sessionId;
        long expiresIn = ChronoUnit.SECONDS.between(LocalDateTime.now(), expiresAt);

        // Infos client
        SsoQrSessionDto.ClientInfo clientInfo = SsoQrSessionDto.ClientInfo.builder()
                .name(client.getName())
                .description(client.getDescription())
                .logoUrl(client.getLogoUrl())
                .build();

        // Scopes demandés avec labels
        List<SsoQrSessionDto.ScopeInfo> scopeInfos = new ArrayList<>();
        for (String s : scopeStr.split(" ")) {
            if (SCOPE_INFO.containsKey(s.trim())) {
                scopeInfos.add(SCOPE_INFO.get(s.trim()));
            }
        }

        return SsoQrSessionDto.builder()
                .sessionId(sessionId)
                .qrContent(qrContent)
                .status(SsoQrStatus.PENDING.name())
                .expiresIn(expiresIn)
                .clientInfo(clientInfo)
                .scopes(scopeInfos)
                .build();
    }

    @Override
    public SsoQrSessionDto getStatus(String sessionId) {
        sessionRepository.expireOldSessions(LocalDateTime.now());

        SsoQrSession session = sessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable"));

        long expiresIn = Math.max(0,
                ChronoUnit.SECONDS.between(LocalDateTime.now(), session.getExpiresAt()));

        String redirectUrl = null;
        if (session.getStatus() == SsoQrStatus.APPROVED && session.getAuthCode() != null) {
            String redirectUri = session.getRedirectUri() != null ? session.getRedirectUri() : "";
            String sep = redirectUri.contains("?") ? "&" : "?";
            redirectUrl = redirectUri + sep + "code=" + session.getAuthCode()
                    + (session.getState() != null ? "&state=" + session.getState() : "");
        }

        return SsoQrSessionDto.builder()
                .sessionId(sessionId)
                .status(session.getStatus().name())
                .expiresIn(expiresIn)
                .redirectUrl(redirectUrl)
                .build();
    }

    @Override
    public byte[] getQrImage(String sessionId) throws Exception {
        SsoQrSession session = sessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable"));

        String qrContent = "eidbf://oauth/qr?session=" + sessionId;

        Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M);
        hints.put(EncodeHintType.MARGIN, 2);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(qrContent, BarcodeFormat.QR_CODE, 300, 300, hints);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", out);
        return out.toByteArray();
    }

    @Override
    public void approveSession(SsoQrApproveRequest request) {
        SsoQrSession session = sessionRepository.findBySessionId(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session introuvable"));

        if (session.getStatus() != SsoQrStatus.PENDING) {
            throw new RuntimeException("Session deja traitee");
        }
        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            session.setStatus(SsoQrStatus.EXPIRED);
            sessionRepository.save(session);
            throw new RuntimeException("Session expiree");
        }

        Personne personne = personneRepository.findByIu(request.getIu())
                .orElseThrow(() -> new RuntimeException("Citoyen introuvable"));

        // Scopes approuvés (intersection demandés ∩ acceptés)
        List<String> requested = Arrays.asList(session.getScope().split(" "));
        List<String> approved = request.getApprovedScopes() != null
                ? request.getApprovedScopes() : requested;
        List<String> finalScopes = new ArrayList<>();
        for (String s : requested) {
            if (approved.contains(s)) finalScopes.add(s);
        }
        if (!finalScopes.contains("openid")) finalScopes.add(0, "openid");

        String approvedScopeStr = String.join(" ", finalScopes);

        // Générer le code d'autorisation OAuth
        String code = UUID.randomUUID().toString().replace("-", "")
                    + UUID.randomUUID().toString().replace("-", "");

        OAuthAuthorizationCode authCode = OAuthAuthorizationCode.builder()
                .code(code)
                .clientId(session.getClientId())
                .redirectUri(session.getRedirectUri() != null ? session.getRedirectUri() : "")
                .scope(approvedScopeStr)
                .state(session.getState())
                .personne(personne)
                .expiresAt(LocalDateTime.now().plusMinutes(CODE_EXPIRY_MINUTES))
                .used(false)
                .build();
        codeRepository.save(authCode);

        session.setStatus(SsoQrStatus.APPROVED);
        session.setAuthCode(code);
        session.setApprovedScopes(approvedScopeStr);
        session.setPersonne(personne);
        sessionRepository.save(session);
    }

    @Override
    public void denySession(String sessionId, String iu) {
        SsoQrSession session = sessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable"));

        if (session.getStatus() == SsoQrStatus.PENDING) {
            session.setStatus(SsoQrStatus.DENIED);
            sessionRepository.save(session);
        }
    }
}
