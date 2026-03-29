package com.wuri.demowuri.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wuri.demowuri.dto.NotificationDto;
import com.wuri.demowuri.services.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @PostMapping("creer")
    public ResponseEntity<NotificationDto> create(@RequestBody NotificationDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping("/unread-count/{personneId}")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long personneId) {
        long count = service.countUnreadByPersonne(personneId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<NotificationDto> update(@PathVariable Long id, @RequestBody NotificationDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

     @GetMapping("/read/{id}")
    public ResponseEntity<NotificationDto> read(@PathVariable Long id) {
        return ResponseEntity.ok(service.read(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<NotificationDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/personne/{personneId}")
    public ResponseEntity<List<NotificationDto>> findByPersonne(@PathVariable Long personneId) {
        return ResponseEntity.ok(service.findByPersonne(personneId));
    }

    @GetMapping("/personne/{personneId}/unread")
    public ResponseEntity<List<NotificationDto>> findUnreadByPersonne(@PathVariable Long personneId) {
        return ResponseEntity.ok(service.findUnreadByPersonne(personneId));
    }
}

