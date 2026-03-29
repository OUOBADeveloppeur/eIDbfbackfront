package com.wuri.demowuri.serviceImpl;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wuri.demowuri.dto.NotificationDto;
import com.wuri.demowuri.mapper.NotificationMapper;
import com.wuri.demowuri.model.Notification;
import com.wuri.demowuri.model.Personne;
import com.wuri.demowuri.repository.NotificationRepository;
import com.wuri.demowuri.repository.PersonneRepository;
import com.wuri.demowuri.services.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;
    private final NotificationMapper mapper;
    private final PersonneRepository personneRepository;

    @Override
    public NotificationDto create(NotificationDto dto) {
        Personne personne = personneRepository.findById(dto.getPersonneId())
                .orElseThrow(() -> new RuntimeException("Personne non trouvée avec id : " + dto.getPersonneId()));

        Notification entity = mapper.toEntity(dto, personne);
        return mapper.toDto(repository.save(entity));
    }


       @Override
    public NotificationDto read(Long id) {
        Notification existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée avec id : " + id));

        existing.setLu(true);

        return mapper.toDto(repository.save(existing));
    }

    @Override
    public NotificationDto update(Long id, NotificationDto dto) {
        Notification existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée avec id : " + id));

        existing.setType(dto.getType());
        existing.setMessage(dto.getMessage());
        existing.setDateEmission(dto.getDateEmission());
        existing.setLu(dto.isLu());

        if (dto.getPersonneId() != null) {
            Personne personne = personneRepository.findById(dto.getPersonneId())
                    .orElseThrow(() -> new RuntimeException("Personne non trouvée avec id : " + dto.getPersonneId()));
            existing.setPersonne(personne);
        }

        return mapper.toDto(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Notification non trouvée avec id : " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public NotificationDto getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée avec id : " + id));
    }

    @Override
    public List<NotificationDto> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDto> findByPersonne(Long personneId) {
        return repository.findByPersonneId(personneId).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDto> findUnreadByPersonne(Long personneId) {
        return repository.findByPersonneIdAndLuFalse(personneId).stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
 @Override
    public long countUnreadByPersonne(Long personneId) {
        return repository.countByPersonneIdAndLuFalse(personneId);
    }
}

