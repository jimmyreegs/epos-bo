package com.regtech.eposbo.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reference;

    @ElementCollection
    @CollectionTable(name = "product_names", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "locale")
    @Column(name = "name")
    private Map<String, String> name;

    @ElementCollection
    @CollectionTable(name = "product_descriptions", joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "locale")
    @Column(name = "description")
    private Map<String, String> description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductPrice> prices;

    @ManyToMany
    @JoinTable(
            name = "product_allergen",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "allergen_id")
    )
    private List<Allergen> allergens;

    private boolean isModifier;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Map<String, String> getName() {
        return name;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public Map<String, String> getDescription() {
        return description;
    }

    public void setDescription(Map<String, String> description) {
        this.description = description;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<ProductPrice> getPrices() {
        return prices;
    }

    public void setPrices(List<ProductPrice> prices) {
        this.prices = prices;
    }

    public List<Allergen> getAllergens() {
        return allergens;
    }

    public void setAllergens(List<Allergen> allergens) {
        this.allergens = allergens;
    }

    public boolean isModifier() {
        return isModifier;
    }

    public void setModifier(boolean modifier) {
        isModifier = modifier;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return isModifier == product.isModifier && Objects.equals(id, product.id) && Objects.equals(reference, product.reference) && Objects.equals(name, product.name) && Objects.equals(description, product.description) && Objects.equals(category, product.category) && Objects.equals(prices, product.prices) && Objects.equals(allergens, product.allergens);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, reference, name, description, category, prices, allergens, isModifier);
    }
}