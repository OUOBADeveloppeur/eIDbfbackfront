package com.wuri.demowuri.services;

public interface WhatsAppService {

    /**
     * Envoie un message OTP via WhatsApp Cloud API.
     *
     * @param phoneNumber numéro local (ex: 70123456) — l'indicatif pays est ajouté automatiquement
     * @param otpCode     code à 6 chiffres à envoyer
     */
    void sendOtp(String phoneNumber, String otpCode);
}
