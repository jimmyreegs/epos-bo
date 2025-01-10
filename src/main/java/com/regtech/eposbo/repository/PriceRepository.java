package com.regtech.eposbo.repository;

import com.regtech.eposbo.model.Price;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {
    // You can add custom queries here if needed in the future
}