package com.wuri.demowuri.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wuri.demowuri.model.TypeDocument;

public interface TypeDocumentRepository extends JpaRepository<TypeDocument, Long> {
        TypeDocument findByLibelle(String libelle);
}
