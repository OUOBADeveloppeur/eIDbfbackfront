package com.wuri.demowuri.repository;

import com.wuri.demowuri.model.OAuthAuthorizationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OAuthAuthorizationCodeRepository extends JpaRepository<OAuthAuthorizationCode, Long> {
    Optional<OAuthAuthorizationCode> findByCode(String code);

    @Modifying
    @Transactional
    @Query("DELETE FROM OAuthAuthorizationCode c WHERE c.expiresAt < :now OR c.used = true")
    void deleteExpired(LocalDateTime now);
}
