package com.regtech.eposbo.controller;

import com.regtech.eposbo.model.Category;
import com.regtech.eposbo.repository.CategoryRepository;
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
@RequestMapping("/categories") // Changed base path to /categories
public class ProductsCategoryController { // New Controller for Category API

    private static final Logger logger = LoggerFactory.getLogger(ProductsCategoryController.class);

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/getCategories")
    public ResponseEntity<List<Category>> getCategories(HttpServletRequest request) {
        try {
            List<Category> categories = categoryRepository.findAll();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            logger.error("Error fetching categories:", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getCategory/{id}")
    public ResponseEntity<Category> getCategory(@PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        return category.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/saveCategory")
    public ResponseEntity<String> newCategory(@RequestBody Category category) {
        try {
            if (category.getReference() == null || category.getReference().isEmpty()) {
                category.setReference(String.valueOf(category.getId()));
            }

            categoryRepository.save(category); // This will handle null parentCategory correctly
            return new ResponseEntity<>("Category saved successfully", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error saving category: ", e);
            return new ResponseEntity<>("Error saving category: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteCategory/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        try {
            categoryRepository.deleteById(id);
            return new ResponseEntity<>("Category deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error deleting category with ID " + id, e);
            return new ResponseEntity<>("Error deleting category: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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