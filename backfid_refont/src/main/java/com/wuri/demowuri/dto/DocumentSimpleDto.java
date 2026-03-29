package com.wuri.demowuri.dto;

import java.time.LocalDate;

import com.wuri.demowuri.enums.EtatDocument;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DocumentSimpleDto {
    private String libelle;
    private LocalDate dateDelivrance;
    private LocalDate dateExpiration;
    private String nip;
     private String reference;
    private EtatDocument etat;
    private Long id;
    private String contenu;
    private String lieuEtablissement;
    private String autorite;


}

