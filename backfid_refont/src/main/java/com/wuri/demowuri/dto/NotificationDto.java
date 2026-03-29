package com.wuri.demowuri.dto;


import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private Long id;
    private String type;
    private String message;
    private LocalDateTime dateEmission;
    private boolean lu;

    private Long personneId; 
}
