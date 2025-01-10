package com.regtech.eposbo.model;

import jakarta.persistence.*;

import java.util.Map;
import java.util.Objects;

@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reference;

    @ElementCollection
    @CollectionTable(name = "category_names", joinColumns = @JoinColumn(name = "category_id"))
    @MapKeyColumn(name = "locale")
    @Column(name = "name")
    private Map<String, String> name;

    @ElementCollection
    @CollectionTable(name = "category_descriptions", joinColumns = @JoinColumn(name = "category_id"))
    @MapKeyColumn(name = "locale")
    @Column(name = "description")
    private Map<String, String> description;

    @ManyToOne
    @JoinColumn(name = "parent_category_id")
    private Category parentCategory;

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

    public Category getParentCategory() {
        return parentCategory;
    }

    public void setParentCategory(Category parentCategory) {
        this.parentCategory = parentCategory;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true; // Check if the same object
        if (o == null || getClass() != o.getClass()) return false; // Ensure the same class
        Category category = (Category) o;
        return Objects.equals(id, category.id) &&
                Objects.equals(reference, category.reference) &&
                Objects.equals(name, category.name) &&
                Objects.equals(description, category.description) &&
                Objects.equals(parentCategory, category.parentCategory);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, reference, name, description, parentCategory);
    }

}