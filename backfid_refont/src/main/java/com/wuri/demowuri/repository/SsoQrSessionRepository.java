package com.wuri.demowuri.repository;

import com.wuri.demowuri.enums.SsoQrStatus;
import com.wuri.demowuri.model.SsoQrSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface SsoQrSessionRepository extends JpaRepository<SsoQrSession, Long> {
    Optional<SsoQrSession> findBySessionId(String sessionId);
    Optional<SsoQrSession> findBySessionIdAndStatus(String sessionId, SsoQrStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE SsoQrSession s SET s.status = 'EXPIRED' WHERE s.expiresAt < :now AND s.status = 'PENDING'")
    void expireOldSessions(LocalDateTime now);
}
