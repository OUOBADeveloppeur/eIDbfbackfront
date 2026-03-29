package com.wuri.demowuri.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wuri.demowuri.dto.EserviceDto;
import com.wuri.demowuri.mapper.EserviceMapper;
import com.wuri.demowuri.model.Eservice;
import com.wuri.demowuri.repository.EserviceRepository;
import com.wuri.demowuri.services.EserviceService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class EserviceServiceImpl implements EserviceService {

    private final EserviceRepository repository;
    private final EserviceMapper mapper;

    @Override
    public EserviceDto create(EserviceDto dto) {
        Eservice entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public EserviceDto update(Long id, EserviceDto dto) {
        Eservice existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Eservice non trouvé avec id : " + id));

        existing.setLibelle(dto.getLibelle());
        existing.setUrl(dto.getUrl());
        existing.setDescription(dto.getDescription());

        return mapper.toDto(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Eservice non trouvé avec id : " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public EserviceDto getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("Eservice non trouvé avec id : " + id));
    }

    @Override
    public List<EserviceDto> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
}

