package com.wuri.demowuri.controller;

import com.wuri.demowuri.dto.MobileDto;
import com.wuri.demowuri.services.MobileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/mobiles")
@RequiredArgsConstructor
public class MobileController {

    private final MobileService mobileService;

    // ─── CRUD ────────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<MobileDto> create(@RequestBody MobileDto dto) {
        return ResponseEntity.ok(mobileService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MobileDto> update(@PathVariable Long id, @RequestBody MobileDto dto) {
        return ResponseEntity.ok(mobileService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        mobileService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MobileDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(mobileService.getById(id));
    }

    @GetMapping("/iu/{iu}")
    public ResponseEntity<List<MobileDto>> getByIu(@PathVariable String iu) {
        return ResponseEntity.ok(mobileService.getByIu(iu));
    }

    // ─── OTP WhatsApp ────────────────────────────────────────────────────────

    /**
     * Vérifie si le numéro fourni est lié à l'IU.
     * Body : { "telephone": "70123456" }
     * Réponse OK  : { "status": "OTP_SENT",        "phone": "70****56" }
     * Réponse KO  : { "status": "PHONE_NOT_FOUND", "phones": ["70****56", ...] }
     */
    @PostMapping("/verify-phone-otp/{iu}")
    public ResponseEntity<Map<String, Object>> verifyPhoneAndSendOtp(
            @PathVariable String iu,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(mobileService.verifyPhoneAndSendOtp(iu, body.get("telephone")));
    }

    /**
     * Envoie l'OTP au numéro sélectionné dans la liste.
     * Body : { "telephoneMasque": "70****56" }
     * Réponse : { "status": "OTP_SENT", "phone": "70****56" }
     */
    @PostMapping("/send-otp-selected/{iu}")
    public ResponseEntity<Map<String, Object>> sendOtpToSelected(
            @PathVariable String iu,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(mobileService.sendOtpToSelected(iu, body.get("telephoneMasque")));
    }

    /**
     * Vérifie le code OTP saisi par l'utilisateur.
     * Body : { "code": "123456" }
     * Réponse : { "valid": true } ou { "valid": false, "message": "..." }
     */
    @PostMapping("/verify-otp/{iu}")
    public ResponseEntity<Map<String, Object>> verifyOtp(
            @PathVariable String iu,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(mobileService.verifyOtp(iu, body.get("code")));
    }
}
