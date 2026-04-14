package com.wuri.demowuri.utiles;

public class WhatsAppNotRegisteredException extends RuntimeException {

    public WhatsAppNotRegisteredException(String phone) {
        super("Le numéro " + phone + " n'est pas enregistré sur WhatsApp.");
    }
}
