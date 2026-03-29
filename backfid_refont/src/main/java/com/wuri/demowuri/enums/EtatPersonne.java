package com.wuri.demowuri.enums;

import java.util.Arrays;

public enum EtatPersonne {
    ACTIF,
    INACTIF;

     /*  public static EtatPersonne fromString(String value) {
        if (value == null) {
            throw new IllegalArgumentException("Etat null");
        }

        return Arrays.stream(values())
                .filter(e -> e.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException("Etat invalide : " + value)
                );
    }
*/
      public static EtatPersonne fromString(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Etat vide ou null");
        }

        return Arrays.stream(values())
                .filter(e -> e.name().equalsIgnoreCase(value))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException("Etat invalide : " + value)
                );
    }
}