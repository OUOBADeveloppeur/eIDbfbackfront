package com.wuri.demowuri.model;

import java.time.LocalDate;

import org.hibernate.annotations.Type;

import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import com.wuri.demowuri.dto.NumeroDocumentDto;
import com.wuri.demowuri.enums.EtatDocument;
import com.wuri.demowuri.enums.EtatPersonne;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // JSON de numéros
   /*  @Column(columnDefinition = "json")
    private String numero;*/

     @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private NumeroDocumentDto numero;

    private LocalDate dateDelivrance;
    private LocalDate dateExpiration;

    private String lieuEtablissement;

    @Column(columnDefinition = "TEXT")
    private String contenu;



    private String photo; // URL ou chemin du fichier

    private Integer taille;

    // contenu numérique (URL ou chemin fichier)
    @Lob
    private String data;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private TypeDocument type;

    @ManyToOne
    @JoinColumn(name = "autorite_id", nullable = false)
    private AutoriteDelivrance autorite;

     @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EtatDocument etat;

     // 🔹 Relation avec Personne
    @ManyToOne
    @JoinColumn(name = "personne_id", nullable = false)
    private Personne personne;
}

