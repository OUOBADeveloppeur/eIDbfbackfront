package com.wuri.demowuri.serviceImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.wuri.demowuri.dto.DocumentDto;
import com.wuri.demowuri.dto.DocumentVM;
import com.wuri.demowuri.dto.NotificationDto;
import com.wuri.demowuri.enums.EtatDocument;
import com.wuri.demowuri.mapper.DocumentMapper;
import com.wuri.demowuri.mapper.NotificationMapper;
import com.wuri.demowuri.model.AutoriteDelivrance;
import com.wuri.demowuri.model.Document;
import com.wuri.demowuri.model.TypeDocument;
import com.wuri.demowuri.repository.AutoriteRepository;
import com.wuri.demowuri.repository.DocumentRepository;
import com.wuri.demowuri.repository.NotificationRepository;
import com.wuri.demowuri.repository.TypeDocumentRepository;
import com.wuri.demowuri.services.DocumentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final NotificationRepository notificationRepository;
    private final AutoriteRepository autoriteRepository;
    private final NotificationMapper notificationMapper;

    private final DocumentMapper mapper;

    private final TypeDocumentRepository typeDocumentRepository;
    private final DocumentMapper documentMapper;

    @Value("${app.photos.dir:photos}")
    private String photosBaseDir;

    @Override
    public DocumentDto create(DocumentDto dto) {

        Document document = mapper.toEntity(dto);
        document.setEtat(EtatDocument.VALIDE);

        return mapper.toDto(documentRepository.save(document));
    }

    @Override
    public DocumentDto update(Long id, DocumentDto documentDto) {
        Document existing = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé avec id : " + id));

        existing.setNumero(documentDto.getNumero());
        existing.setDateDelivrance(documentDto.getDateDelivrance());
        existing.setDateExpiration(documentDto.getDateExpiration());
        existing.setData(documentDto.getData());
        existing.setTaille(documentDto.getTaille());
        existing.setContenu(documentDto.getContenu());
        existing.setLieuEtablissement(documentDto.getLieuEtablissement());
        if (documentDto.getTypeDocument() != null) {
            TypeDocument type = typeDocumentRepository.findById(documentDto.getTypeDocument().getId())
                    .orElseThrow(() -> new RuntimeException("TypeDocument non trouvé"));
            existing.setType(type);
        }

         if (documentDto.getDateExpiration() != null) {
        LocalDate today = LocalDate.now();
        if (documentDto.getDateExpiration().isBefore(today)) {
                existing.setEtat(EtatDocument.EXPIRE);
            } else {
                existing.setEtat(EtatDocument.VALIDE);
            }
        }

        if (documentDto.getAutorite() != null) {
            AutoriteDelivrance autorite = autoriteRepository.findById(documentDto.getAutorite().getId())
                    .orElseThrow(() -> new RuntimeException("Autorité non trouvée"));
            existing.setAutorite(autorite);
        }

        Document updated = documentRepository.save(existing);
        return documentMapper.toDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new RuntimeException("Document non trouvé avec id : " + id);
        }
        documentRepository.deleteById(id);
    }

    @Override
    public DocumentDto getById(Long id) {
        return documentRepository.findById(id)
                .map(documentMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Document non trouvé avec id : " + id));
    }

    @Override
    public List<DocumentDto> getByType(Long typeId) {
        return documentRepository.findByTypeId(typeId).stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    public List<DocumentDto> getByAutorite(Long autoriteId) {
        return documentRepository.findByAutoriteId(autoriteId).stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentDto> findAll() {
        return documentRepository.findAll().stream()
                .map(documentMapper::toDto)
                .collect(Collectors.toList());
    }

   /*  @Override
    @Transactional(readOnly = true)
    public DocumentVM getByTypeLibelleAndPersonneIu1(String typeLibelle, String iu) {
        Document documents = documentRepository.findByTypeLibelleAndPersonneIu(typeLibelle, iu);
        return documentMapper.toDto2(documents);
    }*/

    @Override
    @Transactional
    public DocumentVM getByTypeLibelleAndPersonneIu(String typeLibelle, String iu) {
        Document document = documentRepository.findByTypeLibelleAndPersonneIu(typeLibelle, iu);

        if (document == null) {
            return null;
        }

        // Vérifier si le document est expiré ou expire dans moins d'un mois
        if (document.getDateExpiration() != null) {
            LocalDate now = LocalDate.now();
            boolean isExpired = document.getDateExpiration().isBefore(now);
            boolean expiresWithinThreeMonths = !isExpired
                    && !document.getDateExpiration().isAfter(now.plusMonths(3));

            if (isExpired || expiresWithinThreeMonths) {

                // Mettre à jour l'état si le document est expiré
                if (isExpired && !document.getEtat().equals(EtatDocument.EXPIRE)) {
                    document.setEtat(EtatDocument.EXPIRE);
                    documentRepository.save(document);
                }

                String notifType = isExpired
                        ? "DOCUMENT_EXPIRE_" + document.getId()
                        : "EXPIRATION_DOCUMENT_" + document.getId();

                // Vérifier s'il existe déjà une notification non lue pour ce document
                boolean exists = notificationRepository.existsByPersonneIdAndTypeAndLuFalse(
                        document.getPersonne().getId(), notifType);

                if (!exists) {
                    String message = isExpired
                            ? "Le document " + document.getType().getLibelle()
                                    + " a expiré le " + document.getDateExpiration()
                            : "Le document " + document.getType().getLibelle()
                                    + " va expirer le " + document.getDateExpiration();

                    NotificationDto notification = NotificationDto.builder()
                            .type(notifType)
                            .message(message)
                            .dateEmission(LocalDateTime.now())
                            .lu(false)
                            .personneId(document.getPersonne().getId())
                            .build();

                    notificationRepository.save(notificationMapper.toEntity(notification, document.getPersonne()));
                }
            }
        }

        return documentMapper.toDto2(document);
    }

    @Override
     @Transactional(readOnly = true)
    public List<DocumentVM> getByPersonne(Long personneId) {

        return documentRepository.findByPersonneId(personneId)
                .stream()
                .map(documentMapper::toDto2)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentVM> getByIu(String iu) {
        return documentRepository.findByPersonneIu(iu)
                .stream()
                .map(documentMapper::toDto2)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DocumentVM> getValideByIu(String iu) {
        return documentRepository.findByPersonneIuAndEtat(iu, EtatDocument.VALIDE)
                .stream()
                .map(documentMapper::toDto2)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getStatsByIu(String iu) {
        long total = documentRepository.countByPersonneIu(iu);
        long valides = documentRepository.countByPersonneIuAndEtat(iu, EtatDocument.VALIDE);
        long expires = total - valides;
        return Map.of(
                "total", total,
                "valides", valides,
                "expires", expires
        );
    }

    @Override
    public String uploadPhoto(Long documentId, MultipartFile file) throws IOException {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document introuvable"));

        // 📁 photos/{iu}
        Path documentDir = Paths.get(photosBaseDir, document.getId().toString());

        // Créer le dossier s'il n'existe pas
        if (!Files.exists(documentDir)) {
            Files.createDirectories(documentDir);
        }

        // Nom fixe → remplacement automatique
        Path photoPath = documentDir.resolve("photo.png");

        // Remplacer si existe
        Files.copy(
                file.getInputStream(),
                photoPath,
                StandardCopyOption.REPLACE_EXISTING);

        // Enregistrer le chemin en base
        String relativePath = photosBaseDir + "/" + document.getId() + "/photo.png";
        document.setPhoto(relativePath);
        documentRepository.save(document);

        return relativePath;
    }

    @Override
    public Resource getPhoto(Long documentId) throws IOException {

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document introuvable"));

        if (document.getPhoto() == null) {
            throw new RuntimeException("Aucune photo trouvée");
        }

        Path photoPath = Paths.get(document.getPhoto());

        Resource resource = new UrlResource(photoPath.toUri());
        if (!resource.exists()) {
            throw new RuntimeException("Fichier photo introuvable");
        }

        return resource;
    }
}
