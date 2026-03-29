package com.wuri.demowuri.repository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.wuri.demowuri.enums.EtatQrCode;
import com.wuri.demowuri.model.QrCode;

@Repository
public interface QrCodeRepository extends JpaRepository<QrCode, Long> {

    List<QrCode> findByPersonneId(Long personneId);

    List<QrCode> findByPersonneIdAndEtat( Long personneId, EtatQrCode etat);

    Optional<QrCode> findByToken(String token);
    Optional<QrCode> findByTokenAndSignature(String token, String signature);

    @Modifying
    @Transactional
    @Query("""
        DELETE FROM QrCode q
        WHERE q.personne.id = :personneId
          AND q.dateExpiration <= :now
    """)
    void deleteExpiredByPersonne(
            @Param("personneId") Long personneId,
            @Param("now") LocalDateTime now
    );

    @Modifying
    @Transactional
    void deleteByPersonneId(Long personneId);
}

