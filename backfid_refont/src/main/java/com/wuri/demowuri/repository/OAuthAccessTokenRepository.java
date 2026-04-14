package com.wuri.demowuri.repository;

import com.wuri.demowuri.model.OAuthAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OAuthAccessTokenRepository extends JpaRepository<OAuthAccessToken, Long> {
    Optional<OAuthAccessToken> findByToken(String token);

    @Modifying
    @Transactional
    @Query("DELETE FROM OAuthAccessToken t WHERE t.expiresAt < :now")
    void deleteExpired(LocalDateTime now);
}
