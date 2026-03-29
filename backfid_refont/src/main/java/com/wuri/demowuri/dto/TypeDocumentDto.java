package com.wuri.demowuri.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder   // ✅ OBLIGATOIRE
public class TypeDocumentDto {
    private Long id;
    private String libelle;
    private String description;
}

