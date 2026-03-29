package com.wuri.demowuri.services;


import java.util.List;
import com.wuri.demowuri.dto.TypeDocumentDto;

public interface TypeDocumentService {

    TypeDocumentDto create(TypeDocumentDto dto);

    TypeDocumentDto update(Long id, TypeDocumentDto dto);

    void delete(Long id);

    TypeDocumentDto getById(Long id);

    List<TypeDocumentDto> findAll();
}

