package com.wuri.demowuri.dto;


import lombok.*;
import java.time.LocalDateTime;
import com.wuri.demowuri.enums.EtatQrCode;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QrCodeDto {

    private Long id;
    private String token;
    private String signature;
    private LocalDateTime dateCreation;
    private LocalDateTime dateExpiration;
    private EtatQrCode etat;

    private Long personneId;
}
