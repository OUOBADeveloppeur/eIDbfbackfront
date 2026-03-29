package com.wuri.demowuri.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wuri.demowuri.model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByPersonneId(Long personneId);

    List<Notification> findByPersonneIdAndLuFalse(Long personneId);
    
    boolean existsByPersonneIdAndTypeAndLuFalse(Long personneId, String type);
    
    long countByPersonneIdAndLuFalse(Long personneId);
}

