package com.regtech.eposbo.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
public class Allergen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany(mappedBy = "allergens")
    private List<Product> products;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<Product> getProducts() { return products;}
    public void setProducts(List<Product> products) {this.products = products;}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Allergen allergen = (Allergen) o;
        return Objects.equals(id, allergen.id) && Objects.equals(name, allergen.name) && Objects.equals(products, allergen.products);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, products);
    }
}