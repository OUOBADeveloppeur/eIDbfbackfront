package com.wuri.demowuri.services;

import com.wuri.demowuri.dto.SsoQrApproveRequest;
import com.wuri.demowuri.dto.SsoQrCreateRequest;
import com.wuri.demowuri.dto.SsoQrSessionDto;

public interface SsoQrService {

    /** Crée une session QR (appelé par la plateforme / plugin) */
    SsoQrSessionDto createSession(SsoQrCreateRequest request);

    /** Retourne le statut de la session + redirect_url si APPROVED (polling) */
    SsoQrSessionDto getStatus(String sessionId);

    /** Retourne l'image PNG du QR code en bytes */
    byte[] getQrImage(String sessionId) throws Exception;

    /** Approbation par le citoyen depuis l'app eIDbf */
    void approveSession(SsoQrApproveRequest request);

    /** Refus par le citoyen depuis l'app eIDbf */
    void denySession(String sessionId, String iu);
}
