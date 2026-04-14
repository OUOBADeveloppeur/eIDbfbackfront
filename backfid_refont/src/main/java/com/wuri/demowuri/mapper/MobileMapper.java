package com.wuri.demowuri.mapper;

import com.wuri.demowuri.dto.MobileDto;
import com.wuri.demowuri.model.Mobile;
import org.springframework.stereotype.Component;

@Component
public class MobileMapper {

    public MobileDto toDto(Mobile entity) {
        if (entity == null) return null;
        return MobileDto.builder()
                .id(entity.getId())
                .iu(entity.getIu())
                .numero(entity.getNumero())
                .operateur(entity.getOperateur())
                .valide(entity.getValide())
                .build();
    }

    public Mobile toEntity(MobileDto dto) {
        if (dto == null) return null;
        return Mobile.builder()
                .id(dto.getId())
                .iu(dto.getIu())
                .numero(dto.getNumero())
                .operateur(dto.getOperateur())
                .valide(dto.getValide())
                .build();
    }
}
