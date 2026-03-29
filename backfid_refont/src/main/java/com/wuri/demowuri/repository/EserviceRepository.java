package com.wuri.demowuri.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.wuri.demowuri.model.Eservice;

@Repository
public interface EserviceRepository extends JpaRepository<Eservice, Long> {
    // Optionnel : rechercher par libelle
    Eservice findByLibelle(String libelle);
}
