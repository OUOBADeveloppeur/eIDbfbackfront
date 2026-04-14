package com.wuri.demowuri.dto;

import com.wuri.demowuri.enums.OperateurMobile;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MobileDto {
    private Long id;
    private String iu;
    private String numero;
    private OperateurMobile operateur;
    private Boolean valide;
}
