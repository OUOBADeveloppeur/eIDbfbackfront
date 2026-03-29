package com.wuri.demowuri.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wuri.demowuri.model.AutoriteDelivrance;

public interface AutoriteRepository extends JpaRepository<AutoriteDelivrance, Long> {
        AutoriteDelivrance findByLibelle(String libelle);
}
