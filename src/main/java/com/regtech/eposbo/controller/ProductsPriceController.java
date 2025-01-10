package com.regtech.eposbo.controller;

import com.regtech.eposbo.model.Price;
import com.regtech.eposbo.repository.PriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/prices")
public class ProductsPriceController {

    @Autowired
    private PriceRepository priceRepository;

    @GetMapping("/getPrices")
    public ResponseEntity<List<Price>> getPrices() {
        try {
            List<Price> prices = priceRepository.findAll();
            return ResponseEntity.ok(prices);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/savePrice")
    public ResponseEntity<String> savePrice(@RequestBody Price price) {
        try {
            priceRepository.save(price);
            return new ResponseEntity<>("Price saved successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error saving price: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getPrice/{id}")
    public ResponseEntity<Price> getPrice(@PathVariable Long id) {
        Optional<Price> price = priceRepository.findById(id);
        return price.map(ResponseEntity::ok).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/deletePrice/{id}")
    public ResponseEntity<String> deletePrice(@PathVariable Long id) {
        try {
            priceRepository.deleteById(id);
            return new ResponseEntity<>("Price deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting price: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}