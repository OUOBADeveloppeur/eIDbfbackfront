package com.wuri.demowuri.serviceImpl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wuri.demowuri.enums.EtatDocument;
import com.wuri.demowuri.model.Document;
import com.wuri.demowuri.model.Notification;
import com.wuri.demowuri.repository.DocumentRepository;
import com.wuri.demowuri.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentExpirationScheduler {

    private static final Logger log = LoggerFactory.getLogger(DocumentExpirationScheduler.class);

    private final DocumentRepository documentRepository;
    private final NotificationRepository notificationRepository;

    /**
     * Vérifie quotidiennement les documents qui vont expirer (30j et 7j avant)
     * et ceux déjà expirés. Crée des notifications pour les détenteurs.
     * Exécuté tous les jours à 8h00.
     */
    @Scheduled(cron = "0 0 8 * * *")
    @Transactional
    public void checkDocumentExpirations() {
        log.info("=== Vérification des expirations de documents ===");

        LocalDate today = LocalDate.now();
        LocalDate in30Days = today.plusDays(30);
        LocalDate in7Days = today.plusDays(7);

        // Documents qui expirent dans exactement 30 jours
        checkAndNotify(today.plusDays(29), in30Days, "Rappel", 30);

        // Documents qui expirent dans exactement 7 jours
        checkAndNotify(today.plusDays(6), in7Days, "Alerte", 7);

        // Documents qui expirent aujourd'hui
        checkAndNotify(today.minusDays(1), today, "Alerte", 0);

        // Marquer les documents expirés comme INVALIDE
        markExpiredDocuments(today);

        log.info("=== Fin de la vérification des expirations ===");
    }

    private void checkAndNotify(LocalDate from, LocalDate to, String type, int daysRemaining) {
        List<Document> documents = documentRepository.findByDateExpirationBetween(from, to);

        for (Document doc : documents) {
            if (doc.getPersonne() == null) continue;

            Long personneId = doc.getPersonne().getId();
            String typeDoc = doc.getType() != null ? doc.getType().getLibelle() : "Document";

            // Éviter les doublons : vérifier si une notif similaire non lue existe déjà
            if (notificationRepository.existsByPersonneIdAndTypeAndLuFalse(personneId, type)) {
                continue;
            }

            String message;
            if (daysRemaining == 0) {
                message = String.format(
                    "Votre %s expire aujourd'hui ! Veuillez procéder au renouvellement.",
                    typeDoc
                );
            } else {
                message = String.format(
                    "Votre %s expire dans %d jours (le %s). Pensez à le renouveler.",
                    typeDoc,
                    daysRemaining,
                    doc.getDateExpiration().toString()
                );
            }

            Notification notification = Notification.builder()
                    .type(type)
                    .message(message)
                    .dateEmission(LocalDateTime.now())
                    .lu(false)
                    .personne(doc.getPersonne())
                    .build();

            notificationRepository.save(notification);
            log.info("Notification créée pour {} - {} (expire dans {} jours)",
                    doc.getPersonne().getIu(), typeDoc, daysRemaining);
        }
    }

    private void markExpiredDocuments(LocalDate today) {
        List<Document> expired = documentRepository.findByDateExpirationBeforeAndEtat(
                today, EtatDocument.VALIDE
        );

        for (Document doc : expired) {
            doc.setEtat(EtatDocument.EXPIRE);
            documentRepository.save(doc);
            log.info("Document {} marqué comme EXPIRE (expiré)", doc.getId());
        }
    }
}