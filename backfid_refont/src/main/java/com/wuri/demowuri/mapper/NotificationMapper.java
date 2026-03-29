package com.wuri.demowuri.mapper;


import org.springframework.stereotype.Component;
import com.wuri.demowuri.dto.NotificationDto;
import com.wuri.demowuri.model.Notification;
import com.wuri.demowuri.model.Personne;

@Component
public class NotificationMapper {

    public NotificationDto toDto(Notification entity) {
        if (entity == null) return null;

        return NotificationDto.builder()
                .id(entity.getId())
                .type(entity.getType())
                .message(entity.getMessage())
                .dateEmission(entity.getDateEmission())
                .lu(entity.isLu())
                .personneId(entity.getPersonne() != null ? entity.getPersonne().getId() : null)
                .build();
    }

    public Notification toEntity(NotificationDto dto, Personne personne) {
        if (dto == null) return null;

        return Notification.builder()
                .id(dto.getId())
                .type(dto.getType())
                .message(dto.getMessage())
                .dateEmission(dto.getDateEmission())
                .lu(dto.isLu())
                .personne(personne)
                .build();
    }
}

