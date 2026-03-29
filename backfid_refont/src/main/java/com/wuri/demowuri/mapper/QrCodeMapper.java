package com.wuri.demowuri.mapper;


import org.springframework.stereotype.Component;

import com.wuri.demowuri.dto.QrCodeDto;
import com.wuri.demowuri.model.Personne;
import com.wuri.demowuri.model.QrCode;

@Component
public class QrCodeMapper {

    public QrCodeDto toDto(QrCode entity) {
        if (entity == null) return null;

        return QrCodeDto.builder()
                .id(entity.getId())
                .token(entity.getToken())
                .dateCreation(entity.getDateCreation())
                .dateExpiration(entity.getDateExpiration())
                .etat(entity.getEtat())
                .signature(entity.getSignature())
                .personneId(entity.getPersonne() != null ? entity.getPersonne().getId() : null)
                .build();
    }

    public QrCode toEntity(QrCodeDto dto, Personne personne) {
        if (dto == null) return null;

        return QrCode.builder()
                .id(dto.getId())
                .token(dto.getToken())
                .signature(dto.getSignature())
                .dateCreation(dto.getDateCreation())
                .dateExpiration(dto.getDateExpiration())
                .etat(dto.getEtat())
                .personne(personne)
                .build();
    }
}

