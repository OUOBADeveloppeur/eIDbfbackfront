package com.wuri.demowuri.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.wuri.demowuri.dto.DocumentSimpleDto;
import com.wuri.demowuri.dto.LoginDto;
import com.wuri.demowuri.dto.PersonneDto;
import com.wuri.demowuri.dto.PersonneVM;
import com.wuri.demowuri.dto.QrVerificationResponse;
import com.wuri.demowuri.enums.EtatDocument;
import com.wuri.demowuri.model.Personne;
import com.wuri.demowuri.repository.DocumentRepository;
import com.wuri.demowuri.repository.PersonneRepository;
import com.wuri.demowuri.services.PersonneService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/personnes")
@RequiredArgsConstructor
public class PersonneController {

    private final PersonneService personneService;

    private final PersonneRepository personneRepository;

    private final DocumentRepository documentRepository;

    @PostMapping("creer")
    public PersonneDto create(@RequestBody PersonneDto personneDto) {
        return personneService.createPersonne(personneDto);
    }

    @GetMapping("/getById/{id}")
    public PersonneDto getById(@PathVariable Long id) {
        return personneService.getPersonneById(id);
    }

    @GetMapping("/iu/{iu}")
    public PersonneDto getByIu(@PathVariable String iu) {
        return personneService.getPersonneByIu(iu);
    }

    @GetMapping("all")
    public List<PersonneDto> getAll() {
        return personneService.getAllPersonnes();
    }

    @PutMapping("/update/{id}")
    public PersonneDto update(@PathVariable Long id, @RequestBody PersonneDto personneDto) {
        System.out.println("DTO=======> " + personneDto.toString());
        return personneService.updatePersonne(id, personneDto);
    }

    @PutMapping("/update/iu/{iu}")
    public PersonneDto updateByIu(@PathVariable String iu, @RequestBody PersonneVM personneDto) {

        return personneService.updatePersonneByIu(iu, personneDto);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        personneService.deletePersonne(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto request) {

        PersonneDto personne = personneService.authentifier(
                request.getIu(),
                request.getPassword());

        return ResponseEntity.ok(personne);
    }

    @GetMapping("/telephone/{iu}")
    public ResponseEntity<Map<String, String>> getTelephoneByIu(@PathVariable String iu) {
        String telephone = personneService.getTelephoneByIu(iu);
        return ResponseEntity.ok(Map.of("telephone", telephone != null ? telephone : ""));
    }

    @PutMapping("/{id}/activer")
    public ResponseEntity<PersonneDto> activer(@PathVariable Long id) {
        return ResponseEntity.ok(personneService.activerPersonne(id));
    }

    @PutMapping("/{id}/desactiver")
    public ResponseEntity<PersonneDto> desactiver(@PathVariable Long id) {
        return ResponseEntity.ok(personneService.desactiverPersonne(id));
    }

    @PostMapping(value = "/{iu}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadPhoto(
            @PathVariable String iu,
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            throw new RuntimeException("Fichier photo vide");
        }

        String path = personneService.uploadPhoto(iu, file);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Photo uploadée avec succès",
                        "path", path));
    }

    @GetMapping("/photo/{iu}")
    public ResponseEntity<Resource> getPhoto(@PathVariable String iu) throws IOException {

        Resource photo = personneService.getPhoto(iu);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG) // photo.png
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"photo.png\"")
                .body(photo);
    }

    @GetMapping("/verify/{iu}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> verify(@PathVariable String iu) {

        Optional<Personne> optPersonne = personneRepository.findByIu(iu);

        if (optPersonne.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("statut", "INVALIDE"));
        }

        Personne personne = optPersonne.get();

        List<DocumentSimpleDto> documents = documentRepository
                .findByPersonneIdAndEtat(personne.getId(), EtatDocument.VALIDE)
                .stream()
                .map(d -> new DocumentSimpleDto(
                        d.getType().getLibelle(),
                        d.getDateDelivrance(),
                        d.getDateExpiration(),
                        d.getNumero() != null ? d.getNumero().getNip() : null,
                        d.getNumero() != null ? d.getNumero().getReference() : null,
                        d.getEtat(),
                        d.getId(),
                        d.getContenu(),
                        d.getLieuEtablissement(),
                        d.getAutorite() != null ? d.getAutorite().getLibelle() : null))
                .toList();

        return ResponseEntity.ok(
                QrVerificationResponse.builder()
                        .statut("VALIDE")
                        .iu(personne.getIu())
                        .nom(personne.getNom())
                        .prenom(personne.getPrenom())
                        .dateNaissance(personne.getDateNaissance())
                        .sexe(personne.getSexe())
                        .lieuNaissance(personne.getLieuNaissance())
                        .nationalite(personne.getNationalite())
                        .documentsValides(documents)
                        .verificationTime(LocalDateTime.now())
                        .build());
    }

}
