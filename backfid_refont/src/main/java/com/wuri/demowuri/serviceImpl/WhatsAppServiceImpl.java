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

        // =====================================================================
        // MODE DÉVELOPPEMENT : Simulation de l'envoi de l'OTP
        // L'appel réel à l'API Meta a été mis en commentaire pour débloquer 
        // les tests sur l'application mobile (évite l'erreur "code -1").
        // On affichera simplement le code dans la console du backend.
        // =====================================================================
        System.out.println("\n********************************************************");
        System.out.println("[MOCK] ENVOI DU CODE OTP PAR WHATSAPP SIMULÉ");
        System.out.println("Destinataire : " + to);
        System.out.println("CODE SECRET  : " + otpCode);
        System.out.println("********************************************************\n");

        // --- DÉBUT DU CODE ORIGINAL ---
        // Message texte libre avec le code OTP
        // ATTENTION: Fonctionne dans la fenêtre de 24h après que le destinataire a envoyé un message au numéro de test
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
            System.err.println("[WhatsApp] Corps erreur = " + e.getResponseBodyAsString());

            if (metaCode == 131026 || metaCode == 131030 || metaCode == 131047) {
                // 131026 : numéro non enregistré sur WhatsApp
                // 131030 : numéro non autorisé (sandbox)
                // 131047 : envoi de texte libre hors de la fenêtre des 24h (il faut envoyer un template ou que l'utilisateur vous écrive d'abord)
                throw new WhatsAppNotRegisteredException(phoneNumber);
            }
            throw new RuntimeException("Impossible d'envoyer le code WhatsApp (code " + metaCode + ")");
        } catch (Exception e) {
            System.err.println("[WhatsApp] Échec envoi OTP → " + to + " | " + e.getMessage());
            throw new RuntimeException("Impossible d'envoyer le code WhatsApp : " + e.getMessage());
        }
        // --- FIN DU CODE ORIGINAL ---
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
