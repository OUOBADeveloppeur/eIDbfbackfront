package com.wuri.demowuri.mapper;

import org.springframework.stereotype.Component;
import com.wuri.demowuri.dto.EserviceDto;
import com.wuri.demowuri.model.Eservice;

@Component
public class EserviceMapper {

    public EserviceDto toDto(Eservice entity) {
        if (entity == null) return null;

        return EserviceDto.builder()
                .id(entity.getId())
                .libelle(entity.getLibelle())
                .url(entity.getUrl())
                .description(entity.getDescription())
                .build();
    }

    public Eservice toEntity(EserviceDto dto) {
        if (dto == null) return null;

        return Eservice.builder()
                .id(dto.getId())
                .libelle(dto.getLibelle())
                .url(dto.getUrl())
                .description(dto.getDescription())
                .build();
    }
}
