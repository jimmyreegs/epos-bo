package com.regtech.eposbo.repository;

import com.regtech.eposbo.model.PriceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PriceTypeRepository extends JpaRepository<PriceType, Long> {
    Optional<PriceType> findByName(String name); // Add this method
    boolean existsByName(String name); // Add this line
}

