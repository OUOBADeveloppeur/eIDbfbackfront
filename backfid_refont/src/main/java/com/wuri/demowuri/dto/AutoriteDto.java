package com.wuri.demowuri.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder   // ✅ OBLIGATOIRE
public class AutoriteDto {
    private Long id;
    private String libelle;
    private String adresse;
    private String email;
    private String telephone;
    private String siteWeb;
}
