package com.wuri.demowuri.services;

import com.wuri.demowuri.dto.MobileDto;

import java.util.List;
import java.util.Map;

public interface MobileService {

    MobileDto create(MobileDto dto);

    MobileDto update(Long id, MobileDto dto);

    void delete(Long id);

    MobileDto getById(Long id);

    List<MobileDto> getByIu(String iu);

    // ─── OTP WhatsApp ────────────────────────────────────────────────────────

    /**
     * Vérifie si le numéro fourni est associé à l'IU et envoie un OTP via WhatsApp.
     * Retourne :
     *   {status: "OTP_SENT",        phone: "70****56"}            si numéro trouvé
     *   {status: "PHONE_NOT_FOUND", phones: ["70****56", ...]}    si non trouvé
     *   {status: "IU_NOT_FOUND",    message: "..."}               si IU inconnu
     */
    Map<String, Object> verifyPhoneAndSendOtp(String iu, String telephone);

    /**
     * Envoie l'OTP au numéro sélectionné parmi la liste masquée.
     * Retourne :
     *   {status: "OTP_SENT",       phone: "70****56"}
     *   {status: "SESSION_EXPIRED", message: "..."}
     */
    Map<String, Object> sendOtpToSelected(String iu, String telephoneMasque);

    /**
     * Vérifie le code OTP saisi.
     * Retourne : {valid: true} ou {valid: false, message: "..."}
     */
    Map<String, Object> verifyOtp(String iu, String code);
}
