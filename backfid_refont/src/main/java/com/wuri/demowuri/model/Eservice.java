package com.wuri.demowuri.model;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "eservices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Eservice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String libelle;

    @Column(nullable = false)
    private String url;

    @Column(columnDefinition = "TEXT")
    private String description;
}

