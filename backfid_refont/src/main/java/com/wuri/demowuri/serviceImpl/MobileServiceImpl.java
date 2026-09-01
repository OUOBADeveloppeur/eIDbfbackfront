package com.wuri.demowuri.serviceImpl;

import com.wuri.demowuri.dto.MobileDto;
import com.wuri.demowuri.mapper.MobileMapper;
import com.wuri.demowuri.model.Mobile;
import com.wuri.demowuri.repository.MobileRepository;
import com.wuri.demowuri.repository.PersonneRepository;
import com.wuri.demowuri.services.MobileService;
import com.wuri.demowuri.services.WhatsAppService;
import com.wuri.demowuri.utiles.WhatsAppNotRegisteredException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MobileServiceImpl implements MobileService {

    private final MobileRepository repository;
    private final MobileMapper mapper;
    private final WhatsAppService whatsAppService;
    private final PersonneRepository personneRepository;

    // Sessions OTP en mémoire, clé = iu
    private final Map<String, OtpSession> otpSessions = new ConcurrentHashMap<>();

    private static class OtpSession {
        String code;
        String targetPhone;                  // numéro réel destinataire
        LocalDateTime expiresAt;
        Map<String, String> pendingPhones;   // masqué → réel (phase sélection)
    }

    // ─── CRUD ────────────────────────────────────────────────────────────────

    @Override
    public MobileDto create(MobileDto dto) {
        return mapper.toDto(repository.save(mapper.toEntity(dto)));
    }

    @Override
    public MobileDto update(Long id, MobileDto dto) {
        Mobile existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mobile non trouvé : " + id));
        existing.setNumero(dto.getNumero());
        existing.setOperateur(dto.getOperateur());
        existing.setValide(dto.getValide());
        return mapper.toDto(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id))
            throw new RuntimeException("Mobile non trouvé : " + id);
        repository.deleteById(id);
    }

    @Override
    public MobileDto getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Mobile non trouvé : " + id));
    }

    @Override
    public List<MobileDto> getByIu(String iu) {
        return repository.findByIu(iu).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    // ─── OTP ─────────────────────────────────────────────────────────────────

    @Override
    public Map<String, Object> verifyPhoneAndSendOtp(String iu, String telephone) {
        // 1. Vérifier que la personne existe
        if (!personneRepository.existsByIu(iu)) {
            return Map.of(
                    "status", "IU_NOT_FOUND",
                    "message", "Aucune personne trouvée pour cet identifiant");
        }

        // 2. Récupérer les numéros valides associés à cet IU
        List<Mobile> mobiles = repository.findByIuAndValideTrue(iu);

        if (mobiles.isEmpty()) {
            return Map.of(
                    "status", "IU_NOT_FOUND",
                    "message", "Aucun numéro de téléphone associé à cet identifiant");
        }

        // Le numéro fourni correspond-il à un numéro valide de cet IU ?
        Optional<Mobile> match = mobiles.stream()
                .filter(m -> m.getNumero().equals(telephone))
                .findFirst();

        if (match.isPresent()) {
            String code = generateOtp();
            OtpSession session = new OtpSession();
            session.code = code;
            session.targetPhone = telephone;
            session.expiresAt = LocalDateTime.now().plusMinutes(5);
            otpSessions.put(iu, session);

            try {
                sendWhatsApp(telephone, code);
            } catch (WhatsAppNotRegisteredException e) {
                otpSessions.remove(iu);
                return Map.of(
                        "status", "WHATSAPP_NOT_FOUND",
                        "message", "Ce numéro n'est pas associé à un compte WhatsApp. Vérifiez et réessayez.");
            } catch (Exception e) {
                otpSessions.remove(iu);
                return Map.of(
                        "status", "WHATSAPP_ERROR",
                        "message", "Erreur d'envoi WhatsApp: " + e.getMessage());
            }

            return Map.of(
                    "status", "OTP_SENT",
                    "phone", maskPhone(telephone));
        }

        // Numéro non trouvé : construire la liste masquée et la stocker en session
        Map<String, String> pendingPhones = new LinkedHashMap<>();
        for (Mobile m : mobiles) {
            pendingPhones.put(maskPhone(m.getNumero()), m.getNumero());
        }

        OtpSession session = new OtpSession();
        session.pendingPhones = pendingPhones;
        session.expiresAt = LocalDateTime.now().plusMinutes(5);
        otpSessions.put(iu, session);

        return Map.of(
                "status", "PHONE_NOT_FOUND",
                "phones", new ArrayList<>(pendingPhones.keySet()));
    }

    @Override
    public Map<String, Object> sendOtpToSelected(String iu, String telephoneMasque) {
        OtpSession session = otpSessions.get(iu);

        if (session == null || session.pendingPhones == null
                || LocalDateTime.now().isAfter(session.expiresAt)) {
            return Map.of(
                    "status", "SESSION_EXPIRED",
                    "message", "Session expirée, veuillez recommencer");
        }

        String actualPhone = session.pendingPhones.get(telephoneMasque);
        if (actualPhone == null) {
            return Map.of(
                    "status", "PHONE_NOT_FOUND",
                    "message", "Numéro introuvable dans la session");
        }

        String code = generateOtp();
        session.code = code;
        session.targetPhone = actualPhone;
        session.pendingPhones = null;
        session.expiresAt = LocalDateTime.now().plusMinutes(5);
        otpSessions.put(iu, session);

        try {
            sendWhatsApp(actualPhone, code);
        } catch (WhatsAppNotRegisteredException e) {
            otpSessions.remove(iu);
            return Map.of(
                    "status", "WHATSAPP_NOT_FOUND",
                    "message", "Ce numéro n'est pas associé à un compte WhatsApp. Veuillez en sélectionner un autre.");
        } catch (Exception e) {
            otpSessions.remove(iu);
            return Map.of(
                    "status", "WHATSAPP_ERROR",
                    "message", "Erreur d'envoi WhatsApp: " + e.getMessage());
        }

        return Map.of(
                "status", "OTP_SENT",
                "phone", telephoneMasque);
    }

    @Override
    public Map<String, Object> verifyOtp(String iu, String code) {
        OtpSession session = otpSessions.get(iu);

        if (session == null || session.code == null) {
            return Map.of("valid", false, "message", "Aucune session OTP active");
        }
        if (LocalDateTime.now().isAfter(session.expiresAt)) {
            otpSessions.remove(iu);
            return Map.of("valid", false, "message", "Code expiré");
        }
        if (!session.code.equals(code)) {
            return Map.of("valid", false, "message", "Code incorrect");
        }

        otpSessions.remove(iu);
        return Map.of("valid", true);
    }

    // ─── Utilitaires ─────────────────────────────────────────────────────────

    private String generateOtp() {
        return String.format("%06d", new SecureRandom().nextInt(1_000_000));
    }

    /**
     * Masque les 4 chiffres du milieu.
     * Exemple : 70123456 → 70****56
     */
    private String maskPhone(String phone) {
        if (phone == null || phone.length() <= 6) return phone;
        int start = Math.max(2, phone.length() / 2 - 2);
        return phone.substring(0, start) + "****" + phone.substring(start + 4);
    }

    private void sendWhatsApp(String phone, String code) {
        whatsAppService.sendOtp(phone, code);
    }
}
