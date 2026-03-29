package com.wuri.demowuri.dto;

import java.time.LocalDate;

import com.wuri.demowuri.enums.EtatDocument;

import lombok.Builder;
import lombok.Data;

@Data
@Builder   // ✅ OBLIGATOIRE
public class DocumentDto {
    private Long id;
    private NumeroDocumentDto numero;
    private LocalDate dateDelivrance;
    private LocalDate dateExpiration;
    private String data;
     private String lieuEtablissement;

    private String contenu;

    private TypeDocumentDto typeDocument;
    private AutoriteDto autorite;
    private Long personneId; 
    private EtatDocument etat;
    private String photo;
    private Integer taille;

}

