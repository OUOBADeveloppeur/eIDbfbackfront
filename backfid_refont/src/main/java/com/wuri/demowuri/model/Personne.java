package com.wuri.demowuri.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

import com.wuri.demowuri.enums.EtatPersonne;

@Entity
@Table(name = "personnes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Personne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private LocalDate dateNaissance;

    @Column(length = 10)
    private String sexe; // M / F

    private String nationalite;
    private String telephone;
    private String email;
    private String adresse;

    private String lieuNaissance;

    private String photo; // URL ou chemin du fichier

    @Column(nullable = false, unique = true, length = 12)
    private String iu; // Identifiant Unique

    @Column(nullable = true)
    private String password; // 🔐 mot de passe hashé

    @Column(nullable = true)
    private Boolean agent; 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EtatPersonne etat;

    @OneToMany(mappedBy = "personne", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents;
}
