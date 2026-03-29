package com.wuri.demowuri;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableScheduling
public class DemowuriApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemowuriApplication.class, args);

		 BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    String rawPassword = "2885351Aristide12@@@@2025";
    String encodedPassword = encoder.encode(rawPassword);
    System.out.println("Mot de passe encodé : " + encodedPassword);
	}

}
