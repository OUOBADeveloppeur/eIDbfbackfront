package com.wuri.demowuri.mapper;




import org.springframework.stereotype.Component;

import com.wuri.demowuri.dto.PersonneDto;
import com.wuri.demowuri.model.Personne;

@Component
public class PersonneMapper {


public PersonneDto toDto(Personne personne) {
        if (personne == null) return null;

        return PersonneDto.builder()
                .id(personne.getId())
                .nom(personne.getNom())
                .prenom(personne.getPrenom())
                .agent(personne.getAgent())
                .dateNaissance(personne.getDateNaissance())
                .sexe(personne.getSexe())
                .nationalite(personne.getNationalite())
                .telephone(personne.getTelephone())
                .lieuNaissance(personne.getLieuNaissance())
                .email(personne.getEmail())
                .adresse(personne.getAdresse())
                .photo(personne.getPhoto())
                .iu(personne.getIu())
                .etat(personne.getEtat())
                .build();
    }

    public Personne toEntity(PersonneDto dto) {
        if (dto == null) return null;

        return Personne.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .prenom(dto.getPrenom())
                .agent(dto.getAgent())
                .dateNaissance(dto.getDateNaissance())
                .sexe(dto.getSexe())
                .nationalite(dto.getNationalite())
                .telephone(dto.getTelephone())
                .email(dto.getEmail())
                .lieuNaissance(dto.getLieuNaissance())
                .adresse(dto.getAdresse())
                .photo(dto.getPhoto())
                .iu(dto.getIu())
                .etat(dto.getEtat())
                .build();
    }
}

