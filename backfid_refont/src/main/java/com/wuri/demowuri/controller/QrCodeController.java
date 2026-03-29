package com.wuri.demowuri.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wuri.demowuri.dto.DocumentSimpleDto;
import com.wuri.demowuri.dto.QrCodeDto;
import com.wuri.demowuri.dto.QrVerificationResponse;
import com.wuri.demowuri.enums.EtatDocument;
import com.wuri.demowuri.enums.EtatQrCode;
import com.wuri.demowuri.model.Personne;
import com.wuri.demowuri.model.QrCode;
import com.wuri.demowuri.repository.DocumentRepository;
import com.wuri.demowuri.repository.PersonneRepository;
import com.wuri.demowuri.repository.QrCodeRepository;
import com.wuri.demowuri.securite.QrJwtService;
import com.wuri.demowuri.services.QrCodeService;
import com.wuri.demowuri.utiles.CustumException;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/qrcodes")
@RequiredArgsConstructor
public class QrCodeController {

    private final QrCodeService service;

    private final QrJwtService qrJwtService;

    private final PersonneRepository personneRepository;
    private final DocumentRepository documentRepository;
    private final QrCodeRepository qrCodeRepository;

    @PostMapping("creer")
    public ResponseEntity<QrCodeDto> create(@RequestBody QrCodeDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<QrCodeDto> update(@PathVariable Long id, @RequestBody QrCodeDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<QrCodeDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("all")
    public ResponseEntity<List<QrCodeDto>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/verify")
    @Transactional(readOnly = true)
    public ResponseEntity<QrVerificationResponse> verify(@RequestParam String token,@RequestParam String signature) {

        Claims claims = qrJwtService.parseToken(token);

        QrCode qrCode = qrCodeRepository.findByTokenAndSignature(token, signature)
                .orElseThrow(() -> new CustumException("QR Code inexistant"));

        // 3. Vérifier l’état
        if (qrCode.getEtat() != EtatQrCode.ACTIF) {
            throw new CustumException("QR Code non actif");
        }

        // 4. Vérifier l’expiration métier
        if (qrCode.getDateExpiration().isBefore(LocalDateTime.now())) {
            qrCode.setEtat(EtatQrCode.EXPIRE);
            qrCodeRepository.save(qrCode);
            throw new CustumException("QR Code expiré");
        }

        Long personneId = claims.get("personneId", Long.class);

        Personne personne = personneRepository.findById(personneId)
                .orElseThrow(() -> new RuntimeException("Identité inconnue"));

      List<DocumentSimpleDto> documents = documentRepository
        .findByPersonneIdAndEtat(personneId, EtatDocument.VALIDE)
        .stream()
        .map(d -> new DocumentSimpleDto(
                d.getType().getLibelle(),       // libelle
                d.getDateDelivrance(),          // dateDelivrance
                d.getDateExpiration(),          // dateExpiration
                d.getNumero().getNip(), 
                d.getNumero().getReference(),    // numéro sous forme de String
                d.getEtat(),
                d.getId(),
                d.getContenu(),
                d.getLieuEtablissement(),
                d.getAutorite().getLibelle()               // état
        ))
        .toList();


        return ResponseEntity.ok(
                QrVerificationResponse.builder()
                        .statut("VALIDE")
                        .iu(personne.getIu())
                        .nom(personne.getNom())
                        .prenom(personne.getPrenom())
                        .dateNaissance(personne.getDateNaissance())
                        .sexe(personne.getSexe())
                        .lieuNaissance(personne.getLieuNaissance())
                        .nationalite(personne.getNationalite())
                        .documentsValides(documents)
                        .verificationTime(LocalDateTime.now())
                        .build());
    }

    @GetMapping("/personne/{personneId}")
    public ResponseEntity<List<QrCodeDto>> findByPersonne(@PathVariable Long personneId) {
        return ResponseEntity.ok(service.findByPersonne(personneId));
    }

    @GetMapping("/personne/{personneId}/actifs")
    public ResponseEntity<List<QrCodeDto>> findActifs(@PathVariable Long personneId) {
        return ResponseEntity.ok(service.findActifsByPersonne(personneId));
    }

    @GetMapping("/scan/{code}")
    public ResponseEntity<QrCodeDto> scanQrCode(@PathVariable String token) {
        return ResponseEntity.ok(service.findByToken(token));
    }
}
