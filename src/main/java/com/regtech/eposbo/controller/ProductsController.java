package com.regtech.eposbo.controller;

import com.regtech.eposbo.model.Category;
import com.regtech.eposbo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/products")
public class ProductsController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Value("${app.available-locales}")
    private String availableLocalesString;

    @GetMapping
    public String showProductsPage(Model model) {
        return "products";
    }

    @GetMapping("/availableLocales") // Simplified path - no need for /products/
    @ResponseBody
    public List<String> getAvailableLocales() {
        if (availableLocalesString != null && !availableLocalesString.isEmpty()) {
            return Arrays.stream(availableLocalesString.split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
        } else {
            return List.of(); // Or throw an exception if appropriate
        }
    }
}