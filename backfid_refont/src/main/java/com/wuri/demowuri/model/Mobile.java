package com.wuri.demowuri.model;

import com.wuri.demowuri.enums.OperateurMobile;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mobiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mobile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 12)
    private String iu;

    @Column(nullable = false, length = 20)
    private String numero;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OperateurMobile operateur;

    @Column(nullable = false)
    private Boolean valide;

    // Lecture seule — la colonne "iu" est gérée par le champ String ci-dessus
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "iu", referencedColumnName = "iu", insertable = false, updatable = false)
    private Personne personne;
}
