package com.regtech.eposbo.service;

import com.regtech.eposbo.model.PriceType;
import com.regtech.eposbo.repository.PriceTypeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component; // or @Service

@Component // Or @Service
public class DataInitialiser { // Give a descriptive name

    @Autowired
    private PriceTypeRepository priceTypeRepository;

    @PostConstruct
    public void initializeDefaultPriceType() {
        if (!priceTypeRepository.existsByName("Default")) {
            PriceType defaultPriceType = new PriceType();
            defaultPriceType.setName("Default");
            defaultPriceType.setDescription("System default price type.");
            priceTypeRepository.save(defaultPriceType);
            System.out.println("Default Price Type Created");
        }
    }
}