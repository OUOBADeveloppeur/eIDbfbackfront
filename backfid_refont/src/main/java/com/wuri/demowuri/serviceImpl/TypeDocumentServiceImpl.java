package com.wuri.demowuri.serviceImpl;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wuri.demowuri.dto.TypeDocumentDto;
import com.wuri.demowuri.mapper.TypeDocumentMapper;
import com.wuri.demowuri.model.TypeDocument;
import com.wuri.demowuri.repository.TypeDocumentRepository;
import com.wuri.demowuri.services.TypeDocumentService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class TypeDocumentServiceImpl implements TypeDocumentService {

    private final TypeDocumentRepository repository;
    private final TypeDocumentMapper mapper;

    @Override
    public TypeDocumentDto create(TypeDocumentDto dto) {
        TypeDocument entity = mapper.toEntity(dto);
        return mapper.toDto(repository.save(entity));
    }

    @Override
    public TypeDocumentDto update(Long id, TypeDocumentDto dto) {
        TypeDocument existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("TypeDocument non trouvé avec id : " + id));

        existing.setLibelle(dto.getLibelle());
        existing.setDescription(dto.getDescription());

        return mapper.toDto(repository.save(existing));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("TypeDocument non trouvé avec id : " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public TypeDocumentDto getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDto)
                .orElseThrow(() -> new RuntimeException("TypeDocument non trouvé avec id : " + id));
    }

    @Override
    public List<TypeDocumentDto> findAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }
}

