package com.wuri.demowuri.services;


import java.util.List;
import com.wuri.demowuri.dto.AutoriteDto;

public interface AutoriteService {

    AutoriteDto create(AutoriteDto dto);

    AutoriteDto update(Long id, AutoriteDto dto);

    void delete(Long id);

    AutoriteDto getById(Long id);

    List<AutoriteDto> findAll();
}

