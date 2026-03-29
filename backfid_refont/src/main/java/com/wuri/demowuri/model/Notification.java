package com.wuri.demowuri.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // Exemple : "Info", "Alerte", "Rappel"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private LocalDateTime dateEmission;

    @Column(nullable = false)
    private boolean lu;

    // 🔹 Relation vers Personne
    @ManyToOne
    @JoinColumn(name = "personne_id", nullable = false)
    private Personne personne;
}

