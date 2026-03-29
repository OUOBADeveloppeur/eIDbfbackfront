package com.wuri.demowuri.services;

import java.util.List;
import com.wuri.demowuri.dto.EserviceDto;

public interface EserviceService {

    EserviceDto create(EserviceDto dto);

    EserviceDto update(Long id, EserviceDto dto);

    void delete(Long id);

    EserviceDto getById(Long id);

    List<EserviceDto> findAll();
}
