package com.wuri.demowuri.mapper;

import org.springframework.stereotype.Component;

import com.wuri.demowuri.dto.TypeDocumentDto;
import com.wuri.demowuri.model.TypeDocument;

@Component
public class TypeDocumentMapper {

    public TypeDocumentDto toDto(TypeDocument entity) {
        if (entity == null) return null;

        return TypeDocumentDto.builder()
                .id(entity.getId())
                .libelle(entity.getLibelle())
                .description(entity.getDescription())
                .build();
    }

    public TypeDocument toEntity(TypeDocumentDto dto) {
        if (dto == null) return null;

        return TypeDocument.builder()
                .id(dto.getId())
                .libelle(dto.getLibelle())
                .description(dto.getDescription())
                .build();
    }
}

