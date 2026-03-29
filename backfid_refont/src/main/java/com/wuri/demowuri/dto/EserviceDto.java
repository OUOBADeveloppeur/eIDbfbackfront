package com.wuri.demowuri.dto;


import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EserviceDto {
    private Long id;
    private String libelle;
    private String url;
    private String description;
}

