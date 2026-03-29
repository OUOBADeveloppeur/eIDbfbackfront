package com.wuri.demowuri.services;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.wuri.demowuri.dto.DocumentDto;
import com.wuri.demowuri.dto.DocumentVM;

public interface DocumentService {
     DocumentDto create(DocumentDto dto);
    List<DocumentDto> findAll();
    DocumentDto update(Long id, DocumentDto documentDto);

    void delete(Long id);

    DocumentDto getById(Long id);

    List<DocumentDto> getByType(Long typeId);

    List<DocumentDto> getByAutorite(Long autoriteId);

    DocumentVM getByTypeLibelleAndPersonneIu(String typeLibelle, String iu);

    List<DocumentVM> getByPersonne(Long personneId);

    List<DocumentVM> getByIu(String iu);

    List<DocumentVM> getValideByIu(String iu);

    Map<String, Long> getStatsByIu(String iu);

    Resource getPhoto(Long documendId) throws IOException;

    String uploadPhoto(Long documendId, MultipartFile file) throws IOException;

}
