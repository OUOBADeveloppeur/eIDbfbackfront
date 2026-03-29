package com.wuri.demowuri.dto;


import lombok.*;

import java.time.LocalDate;
import java.util.List;

import com.wuri.demowuri.enums.EtatPersonne;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonneVM {

    private Long id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private String sexe;
    private String lieuNaissance;
    private String password;
    private Boolean agent;

}

