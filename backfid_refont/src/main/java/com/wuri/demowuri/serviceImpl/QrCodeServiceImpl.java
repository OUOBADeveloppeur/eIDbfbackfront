package com.wuri.demowuri.serviceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wuri.demowuri.dto.QrCodeDto;
import com.wuri.demowuri.enums.EtatQrCode;
import com.wuri.demowuri.mapper.QrCodeMapper;
import com.wuri.demowuri.model.Personne;
import com.wuri.demowuri.model.QrCode;
import com.wuri.demowuri.repository.PersonneRepository;
import com.wuri.demowuri.repository.QrCodeRepository;
import com.wuri.demowuri.securite.QrJwtService;
import com.wuri.demowuri.services.QrCodeService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class QrCodeServiceImpl implements QrCodeService {

    private final QrCodeRepository repository;
    private final PersonneRepository personneRepository;
    private final QrCodeMapper mapper;
    private final QrJwtService qrJwtService;

    @Override
    public QrCodeDto create(QrCodeDto dto) {

        Personne personne = personneRepository.findById(dto.getPersonneId())
                .orElseThrow(() -> new RuntimeException("Personne introuvable"));

        repository.deleteByPersonneId(personne.getId());

        Map<String, Object> claims = Map.of(
                "personneId", personne.getId(),
                "iu", personne.getIu(),
                "scope", "IDENTITY_VERIFICATION");

        String token = qrJwtService.generateQrToken(claims);
        String signature = "@WURI2026@";

        QrCode qrCode = QrCode.builder()
                .token(token)
                .signature(signature)
                .dateCreation(LocalDateTime.now())
                .dateExpiration(LocalDateTime.now().plusMinutes(5))
                .etat(EtatQrCode.ACTIF)
                .personne(personne)
                .build();

        return mapper.toDto(repository.save(qrCode));
    }

    @Override
    public QrCodeDto update(Long id, QrCodeDto dto) {

        QrCode existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("QR Code non trouvé"));

        existing.setDateExpiration(dto.getDateExpiration());
        existing.setEtat(dto.getEtat());

        return mapper.toDto(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("QR Code non trouvé");
        }
        repository.deleteById(id);
    }

    @Override
    public QrCodeDto getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("QR Code non trouvé"));
    }

    @Override
    public List<QrCodeDto> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QrCodeDto> findByPersonne(Long personneId) {
        return repository.findByPersonneId(personneId).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<QrCodeDto> findActifsByPersonne(Long personneId) {
        return repository.findByPersonneIdAndEtat(personneId, EtatQrCode.ACTIF)
                .stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public QrCodeDto findByToken(String code) {
        return repository.findByToken(code)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("QR Code invalide ou inexistant"));
    }
}
