package com.wuri.demowuri.services;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.wuri.demowuri.dto.PersonneDto;
import com.wuri.demowuri.dto.PersonneVM;

public interface PersonneService {

    PersonneDto createPersonne(PersonneDto userDto);

    PersonneDto getPersonneById(Long id);

    PersonneDto authentifier(String iu, String password);

    PersonneDto getPersonneByIu(String iu);

    List<PersonneDto> getAllPersonnes();

    PersonneDto updatePersonne(Long id, PersonneDto userDto);
        
    PersonneDto updatePersonneByIu(String iu, PersonneVM userDto);


    void deletePersonne(Long id);

    Resource getPhoto(String iu) throws IOException;

    String uploadPhoto(String iu, MultipartFile file) throws IOException;

     PersonneDto activerPersonne(Long id);

    PersonneDto desactiverPersonne(Long id);

    String getTelephoneByIu(String iu);
}
