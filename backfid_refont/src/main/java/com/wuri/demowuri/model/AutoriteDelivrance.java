package com.wuri.demowuri.model;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "autorites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AutoriteDelivrance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String libelle;

    private String adresse;
    private String email;
    private String telephone;
    private String siteWeb;
}

