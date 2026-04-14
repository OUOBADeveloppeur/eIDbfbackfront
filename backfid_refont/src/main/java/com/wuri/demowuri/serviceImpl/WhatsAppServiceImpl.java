package com.wuri.demowuri.serviceImpl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wuri.demowuri.services.WhatsAppService;
import com.wuri.demowuri.utiles.WhatsAppNotRegisteredException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class WhatsAppServiceImpl implements WhatsAppService {

    private final RestTemplate restTemplate;

    @Value("${whatsapp.api.url}")
    private String apiUrl;

    @Value("${whatsapp.phone-number-id}")
    private String phoneNumberId;

    @Value("${whatsapp.access-token}")
    private String accessToken;

    @Value("${whatsapp.country-code}")
    private String countryCode;

    @Value("${whatsapp.template-name:hello_world}")
    private String templateName;

    @Value("${whatsapp.template-lang:en_US}")
    private String templateLang;

    @Override
    public void sendOtp(String phoneNumber, String otpCode) {
        String to = formatPhone(phoneNumber);

        // Message texte libre avec le code OTP
        // Fonctionne dans la fenêtre de 24h après que le destinataire a reçu un template
        // En production : remplacer par un template OTP approuvé par Meta
        Map<String, Object> body = Map.of(
                "messaging_product", "whatsapp",
                "recipient_type", "individual",
                "to", to,
                "type", "text",
                "text", Map.of(
                        "preview_url", false,
                        "body", buildMessage(otpCode)
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        String url = apiUrl + "/" + phoneNumberId + "/messages";

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    String.class
            );
            System.out.println("[WhatsApp] Envoi OTP → " + to + " | statut : " + response.getStatusCode());
        } catch (HttpClientErrorException e) {
            // Analyser le corps d'erreur retourné par Meta
            int metaCode = extractMetaErrorCode(e.getResponseBodyAsString());
            System.err.println("[WhatsApp] Erreur Meta code=" + metaCode + " → " + to);

            if (metaCode == 131026 || metaCode == 131030) {
                // 131026 : numéro non enregistré sur WhatsApp
                // 131030 : numéro non autorisé (sandbox) → même traitement côté mobile
                throw new WhatsAppNotRegisteredException(phoneNumber);
            }
            throw new RuntimeException("Impossible d'envoyer le code WhatsApp (code " + metaCode + ")");
        } catch (Exception e) {
            System.err.println("[WhatsApp] Échec envoi OTP → " + to + " | " + e.getMessage());
            throw new RuntimeException("Impossible d'envoyer le code WhatsApp : " + e.getMessage());
        }
    }

    /**
     * Formate le numéro local en E.164 sans le "+".
     * Exemples :
     *   "70123456"      → "22670123456"
     *   "+22670123456"  → "22670123456"
     *   "22670123456"   → "22670123456"
     */
    private String formatPhone(String phone) {
        String cleaned = phone.replaceAll("\\s+", "").replaceAll("^\\+", "");
        if (cleaned.startsWith(countryCode)) {
            return cleaned;
        }
        return countryCode + cleaned;
    }

    /**
     * Extrait le code d'erreur Meta depuis le corps JSON de la réponse.
     * Exemple : {"error": {"code": 131026, ...}}
     */
    private int extractMetaErrorCode(String responseBody) {
        try {
            JsonNode root = new ObjectMapper().readTree(responseBody);
            JsonNode codeNode = root.path("error").path("code");
            if (!codeNode.isMissingNode()) return codeNode.asInt();
        } catch (Exception ignored) {}
        return -1;
    }

    private String buildMessage(String code) {
        return "Votre code de vérification eIDbf est : *" + code + "*\n"
                + "Ce code est valable 5 minutes.\n"
                + "Ne le communiquez à personne.";
    }
}
