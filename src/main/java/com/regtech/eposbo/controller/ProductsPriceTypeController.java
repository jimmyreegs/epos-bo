package com.regtech.eposbo.controller;

import com.regtech.eposbo.model.PriceType;
import com.regtech.eposbo.repository.PriceTypeRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/priceTypes") // Changed base path to /priceTypes
public class ProductsPriceTypeController {

    private static final Logger logger = LoggerFactory.getLogger(ProductsPriceTypeController.class);

    @Autowired
    private PriceTypeRepository priceTypeRepository;

    @GetMapping("/getPriceTypes")
    public ResponseEntity<List<PriceType>> getPriceTypes(HttpServletRequest request) {
        try {
            List<PriceType> priceTypes = priceTypeRepository.findAll();
            return ResponseEntity.ok(priceTypes);
        } catch (Exception e) {
            logger.error("Error fetching price types:", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getPriceType/{id}")
    public ResponseEntity<PriceType> getPriceType(@PathVariable Long id) {
        Optional<PriceType> priceType = priceTypeRepository.findById(id);
        return priceType.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/savePriceType")
    public ResponseEntity<String> newPriceType(@RequestBody PriceType priceType) {
        try {
            priceTypeRepository.save(priceType);
            return new ResponseEntity<>("Price type saved successfully", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error saving price type: ", e);
            return new ResponseEntity<>("Error saving price type: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deletePriceType/{id}")
    public ResponseEntity<String> deletePriceType(@PathVariable Long id) {
        try {
            priceTypeRepository.deleteById(id);
            return new ResponseEntity<>("Price type deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error deleting price type with ID " + id, e);
            return new ResponseEntity<>("Error deleting price type: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private String getSystemLanguage(HttpServletRequest request) {
        if (request.getCookies() != null) {
            Optional<Cookie> localeCookie = java.util.Arrays.stream(request.getCookies())
                    .filter(c -> "systemLanguage".equals(c.getName()))
                    .findFirst();
            return localeCookie.map(Cookie::getValue).orElse("en");
        }
        return "en";
    }
}