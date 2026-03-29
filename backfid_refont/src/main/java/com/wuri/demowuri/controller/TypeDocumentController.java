package com.wuri.demowuri.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.wuri.demowuri.dto.TypeDocumentDto;
import com.wuri.demowuri.services.TypeDocumentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/typedocuments")
@RequiredArgsConstructor
public class TypeDocumentController {

    private final TypeDocumentService service;

    @PostMapping("creer")
    public ResponseEntity<TypeDocumentDto> create(@RequestBody TypeDocumentDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TypeDocumentDto> update(@PathVariable Long id, @RequestBody TypeDocumentDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<TypeDocumentDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("all")
    public ResponseEntity<List<TypeDocumentDto>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
}

