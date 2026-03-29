package com.wuri.demowuri.serviceImpl;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wuri.demowuri.dto.AutoriteDto;
import com.wuri.demowuri.mapper.AutoriteMapper;
import com.wuri.demowuri.model.AutoriteDelivrance;
import com.wuri.demowuri.repository.AutoriteRepository;
import com.wuri.demowuri.services.AutoriteService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AutoriteServiceImpl implements AutoriteService {

    private final AutoriteRepository repository;
    private final AutoriteMapper mapper;

    @Override
    public AutoriteDto create(AutoriteDto dto) {
        AutoriteDelivrance entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public AutoriteDto update(Long id, AutoriteDto dto) {
        AutoriteDelivrance existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Autorité non trouvée avec id : " + id));

        existing.setLibelle(dto.getLibelle());
        existing.setAdresse(dto.getAdresse());
        existing.setEmail(dto.getEmail());
        existing.setTelephone(dto.getTelephone());
        existing.setSiteWeb(dto.getSiteWeb());

        return mapper.toDto(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Autorité non trouvée avec id : " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public AutoriteDto getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Autorité non trouvée avec id : " + id));
    }

    @Override
    public List<AutoriteDto> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
}

