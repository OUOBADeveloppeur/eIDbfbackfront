package com.wuri.demowuri.mapper;

import org.springframework.stereotype.Component;

import com.wuri.demowuri.dto.AutoriteDto;
import com.wuri.demowuri.model.AutoriteDelivrance;

@Component
public class AutoriteMapper {

    public AutoriteDto toDto(AutoriteDelivrance entity) {
        if (entity == null) return null;

        return AutoriteDto.builder()
                .id(entity.getId())
                .libelle(entity.getLibelle())
                .adresse(entity.getAdresse())
                .email(entity.getEmail())
                .telephone(entity.getTelephone())
                .siteWeb(entity.getSiteWeb())
                .build();
    }

    public AutoriteDelivrance toEntity(AutoriteDto dto) {
        if (dto == null) return null;

        return AutoriteDelivrance.builder()
                .id(dto.getId())
                .libelle(dto.getLibelle())
                .adresse(dto.getAdresse())
                .email(dto.getEmail())
                .telephone(dto.getTelephone())
                .siteWeb(dto.getSiteWeb())
                .build();
    }
}

