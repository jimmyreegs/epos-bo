package com.regtech.eposbo.controller;

import com.regtech.eposbo.model.Product;
import com.regtech.eposbo.repository.ProductRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductsProductController { // New Controller for Product API

    private static final Logger logger = LoggerFactory.getLogger(ProductsProductController.class);

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/getProducts")
    public ResponseEntity<List<Product>> getProducts(HttpServletRequest request) {
        String systemLanguage = getSystemLanguage(request);
        try {
            List<Product> products = productRepository.findAll();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error fetching products:", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getProduct/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveProduct(@RequestBody Product product) {
        try {
            if (product.getReference() == null || product.getReference().isEmpty()) {
                product.setReference(String.valueOf(product.getId()));
            }
            productRepository.save(product);
            return new ResponseEntity<>("Product saved successfully", HttpStatus.OK); // Return a success message
        } catch (Exception e) {
            logger.error("Error saving product: ", e);
            return new ResponseEntity<>("Error saving product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        try {
            productRepository.deleteById(id);
            return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
        } catch (EmptyResultDataAccessException e) {
            // Handle the case where the product is not found
            logger.error("Product with ID {} not found for deletion.", id, e);
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Error deleting product with ID " + id, e);
            return new ResponseEntity<>("Error deleting product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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