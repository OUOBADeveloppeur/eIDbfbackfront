package com.wuri.demowuri.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.wuri.demowuri.dto.AutoriteDto;
import com.wuri.demowuri.services.AutoriteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/autorites")
@RequiredArgsConstructor
public class AutoriteController {

    private final AutoriteService service;

    @PostMapping("creer")
    public ResponseEntity<AutoriteDto> create(@RequestBody AutoriteDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AutoriteDto> update(@PathVariable Long id, @RequestBody AutoriteDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<AutoriteDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("all")
    public ResponseEntity<List<AutoriteDto>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
}

