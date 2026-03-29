package com.wuri.demowuri.dto;


import lombok.*;

import java.time.LocalDate;
import java.util.List;

import com.wuri.demowuri.enums.EtatPersonne;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonneDto {

    private Long id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String sexe;
    private String nationalite;
    private String telephone;
    private String email;
    private String adresse;
    private String photo;
    private String iu;
    private String lieuNaissance;
    private String password;
    private EtatPersonne etat;
    private Boolean agent;

}

