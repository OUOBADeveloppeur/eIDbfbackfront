package com.wuri.demowuri.services;


import java.util.List;

import com.wuri.demowuri.dto.NotificationDto;

public interface NotificationService {

    NotificationDto create(NotificationDto dto);

    NotificationDto update(Long id, NotificationDto dto);

    void delete(Long id);

    NotificationDto getById(Long id);
    NotificationDto read(Long id);

    List<NotificationDto> findAll();

    List<NotificationDto> findByPersonne(Long personneId);

    List<NotificationDto> findUnreadByPersonne(Long personneId);

    long countUnreadByPersonne(Long personneId);
}

