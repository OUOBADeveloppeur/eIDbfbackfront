package com.wuri.demowuri.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QrVerificationResponse {

    private String statut; // VALIDE / EXPIRE / INVALIDE

    private String iu;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String sexe;
    private String nationalite;
    private String lieuNaissance;


    //private List<String> documentsValides;
    private List<DocumentSimpleDto> documentsValides;

    private LocalDateTime verificationTime;
}
