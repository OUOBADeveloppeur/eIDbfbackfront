package com.wuri.demowuri.serviceImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.wuri.demowuri.dto.NotificationDto;
import com.wuri.demowuri.dto.PersonneDto;
import com.wuri.demowuri.dto.PersonneVM;
import com.wuri.demowuri.enums.EtatPersonne;
import com.wuri.demowuri.mapper.NotificationMapper;
import com.wuri.demowuri.mapper.PersonneMapper;
import com.wuri.demowuri.model.Personne;
import com.wuri.demowuri.repository.NotificationRepository;
import com.wuri.demowuri.repository.PersonneRepository;
import com.wuri.demowuri.services.PersonneService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PersonneServiceImpl implements PersonneService {

    private final PersonneRepository personneRepository;
    private final PersonneMapper personneMapper;
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Value("${app.photos.dir:photos}")
    private String photosBaseDir;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public PersonneDto createPersonne(PersonneDto userDto) {

        // IU toujours généré côté backend
        String iu = generateUniqueIU();
        userDto.setIu(iu);

        // userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

        Personne user = personneMapper.toEntity(userDto);
        user.setEtat(EtatPersonne.ACTIF);
        return personneMapper.toDto(personneRepository.save(user));
    }

    private String generateUniqueIU() {
        String iu;
        do {
            iu = generate12DigitNumber();
        } while (personneRepository.existsByIu(iu));

        return iu;
    }

    @Override
    public PersonneDto authentifier(String iu, String password) {

        System.out.println("Mot de passe======= " + password);
        System.out.println("IU======= " + iu);

        Personne personne = personneRepository.findByIu(iu)
                .orElseThrow(() -> new RuntimeException("IU incorrect"));

        if (!passwordEncoder.matches(password, personne.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }
        NotificationDto notification = NotificationDto.builder()
                .type("CONNEXION AU COMPTE")
                .message(personne.getNom() + " " + personne.getPrenom() + " s'est connecté votre compte ")
                .dateEmission(LocalDateTime.now())
                .lu(false)
                .personneId(personne.getId())
                .build();

        notificationRepository.save(notificationMapper.toEntity(notification, personne));

        return personneMapper.toDto(personne);
    }

    private String generate12DigitNumber() {
        long number = (long) (Math.random() * 1_000_000_000_000L);
        return String.format("%012d", number);
    }

    @Override
    public PersonneDto getPersonneById(Long id) {
        return personneRepository.findById(id)
                .map(personneMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    @Override
    public PersonneDto getPersonneByIu(String iu) {
        Personne personne = personneRepository.findByIu(iu)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Personne introuvable"));
        return personneMapper.toDto(personne);
    }

    @Override
    public List<PersonneDto> getAllPersonnes() {
        return personneRepository.findAll()
                .stream()
                .map(personneMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PersonneDto updatePersonneByIu(String iu, PersonneVM userDto) {
        Personne user = personneRepository.findByIu(iu)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        System.out.print("===================== " + userDto.toString());
        user.setNom(userDto.getNom());
        user.setPrenom(userDto.getPrenom());
        user.setDateNaissance(userDto.getDateNaissance());
        user.setSexe(userDto.getSexe());
        user.setLieuNaissance(userDto.getLieuNaissance());

        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

        // Vérifier s'il existe déjà une notification non lue pour ce document
        /*
         * boolean exists = notificationRepository.existsByPersonneIdAndTypeAndLuFalse(
         * user.getId(),
         * "CONNEXION AU COMPTE_" + user.getId());
         */

        // Créer et enregistrer la notification
        NotificationDto notification = NotificationDto.builder()
                .type("MODIFICATION DU COMPTE")
                .message(user.getNom() + " " + user.getPrenom() + " a modifé votre compte ")
                .dateEmission(LocalDateTime.now())
                .lu(false)
                .personneId(user.getId())
                .build();

        notificationRepository.save(notificationMapper.toEntity(notification, user));

        return personneMapper.toDto(personneRepository.save(user));
    }

    @Override
    public PersonneDto updatePersonne(Long id, PersonneDto userDto) {
        Personne user = personneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        user.setNom(userDto.getNom());
        user.setPrenom(userDto.getPrenom());
        user.setDateNaissance(userDto.getDateNaissance());
        user.setSexe(userDto.getSexe());
        user.setLieuNaissance(userDto.getLieuNaissance());
        user.setNationalite(userDto.getNationalite());
        user.setAdresse(userDto.getAdresse());
        user.setEtat(userDto.getEtat());
        user.setAgent(userDto.getAgent());


        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }

        return personneMapper.toDto(personneRepository.save(user));
    }

    @Override
    public void deletePersonne(Long id) {
        personneRepository.deleteById(id);
    }

    @Override
    public String uploadPhoto(String iu, MultipartFile file) throws IOException {

        Personne personne = personneRepository.findByIu(iu)
                .orElseThrow(() -> new RuntimeException("Personne introuvable"));

        // 📁 photos/{iu}
        Path personneDir = Paths.get(photosBaseDir, iu);

        // Créer le dossier s'il n'existe pas
        if (!Files.exists(personneDir)) {
            Files.createDirectories(personneDir);
        }

        // Nom fixe → remplacement automatique
        Path photoPath = personneDir.resolve("photo.png");

        // Remplacer si existe
        Files.copy(
                file.getInputStream(),
                photoPath,
                StandardCopyOption.REPLACE_EXISTING);

        // Enregistrer le chemin en base
        String relativePath = photosBaseDir + "/" + iu + "/photo.png";
        personne.setPhoto(relativePath);
        personneRepository.save(personne);

        return relativePath;
    }

    @Override
    public Resource getPhoto(String iu) throws IOException {

        Personne personne = personneRepository.findByIu(iu)
                .orElseThrow(() -> new RuntimeException("Personne introuvable"));

        if (personne.getPhoto() == null) {
            throw new RuntimeException("Aucune photo trouvée");
        }

        Path photoPath = Paths.get(personne.getPhoto());

        Resource resource = new UrlResource(photoPath.toUri());
        if (!resource.exists()) {
            throw new RuntimeException("Fichier photo introuvable");
        }

        return resource;
    }

    @Override
    public PersonneDto activerPersonne(Long id) {
        Personne personne = personneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personne introuvable"));

        personne.setEtat(EtatPersonne.ACTIF);

        return personneMapper.toDto(personneRepository.save(personne));
    }

    @Override
    public String getTelephoneByIu(String iu) {
        Personne personne = personneRepository.findByIu(iu)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Personne introuvable"));
        return personne.getTelephone();
    }

    @Override
    public PersonneDto desactiverPersonne(Long id) {
        Personne personne = personneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personne introuvable"));

        personne.setEtat(EtatPersonne.INACTIF);

        return personneMapper.toDto(personneRepository.save(personne));
    }
}
