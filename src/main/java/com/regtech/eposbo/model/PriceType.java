package com.regtech.eposbo.model;

import jakarta.persistence.*;
import java.util.Objects;

@Entity
public class PriceType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true) // Add these attributes to the Column annotation
    private String name;
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {this.description = description; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PriceType priceType = (PriceType) o;
        return Objects.equals(id, priceType.id) && Objects.equals(name, priceType.name) && Objects.equals(description, priceType.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description);
    }
}