package com.wuri.demowuri.serviceImpl;



import org.springframework.stereotype.Service;

import com.wuri.demowuri.repository.AutoriteRepository;
import com.wuri.demowuri.repository.EserviceRepository;
import com.wuri.demowuri.repository.PersonneRepository;
import com.wuri.demowuri.repository.UserRepository;

@Service
public class StatsServiceImpl {

    private final PersonneRepository personneRepository;
    private final UserRepository userRepository;
    private final AutoriteRepository autoriteRepository;
    private final EserviceRepository eserviceRepository;

    public StatsServiceImpl(PersonneRepository personneRepository,
                        UserRepository userRepository,
                        AutoriteRepository autoriteRepository,
                        EserviceRepository eserviceRepository) {
        this.personneRepository = personneRepository;
        this.userRepository = userRepository;
        this.autoriteRepository = autoriteRepository;
        this.eserviceRepository = eserviceRepository;
    }

    public long countPersonnes() {
        return personneRepository.count();
    }

    public long countUsers() {
        return userRepository.count();
    }

    public long countAutorites() {
        return autoriteRepository.count();
    }

    public long countEservices() {
        return eserviceRepository.count();
    }
}

