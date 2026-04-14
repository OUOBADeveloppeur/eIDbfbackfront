package com.wuri.demowuri.repository;

import com.wuri.demowuri.model.Mobile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MobileRepository extends JpaRepository<Mobile, Long> {

    List<Mobile> findByIu(String iu);

    List<Mobile> findByIuAndValideTrue(String iu);

    Optional<Mobile> findByIuAndNumero(String iu, String numero);

    boolean existsByIuAndNumero(String iu, String numero);
}
