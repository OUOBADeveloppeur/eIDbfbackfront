package com.wuri.demowuri.services;


import java.util.List;
import com.wuri.demowuri.dto.QrCodeDto;

public interface QrCodeService {

    QrCodeDto create(QrCodeDto dto);

    QrCodeDto update(Long id, QrCodeDto dto);

    void delete(Long id);

    QrCodeDto getById(Long id);

    List<QrCodeDto> findAll();

    List<QrCodeDto> findByPersonne(Long personneId);

    List<QrCodeDto> findActifsByPersonne(Long personneId);

    QrCodeDto findByToken(String code);
}

