package com.regtech.eposbo.repository;

import com.regtech.eposbo.model.Allergen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AllergenRepository extends JpaRepository<Allergen, Long> {
    Optional<Allergen> findByName(String name); // Add this method
}