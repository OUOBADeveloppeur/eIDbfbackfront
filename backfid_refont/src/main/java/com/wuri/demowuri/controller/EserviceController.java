package com.wuri.demowuri.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.wuri.demowuri.dto.EserviceDto;
import com.wuri.demowuri.services.EserviceService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/eservices")
@RequiredArgsConstructor
public class EserviceController {

    private final EserviceService service;

    @PostMapping("creer")
    public ResponseEntity<EserviceDto> create(@RequestBody EserviceDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<EserviceDto> update(@PathVariable Long id, @RequestBody EserviceDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<EserviceDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("all")
    public ResponseEntity<List<EserviceDto>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
}

