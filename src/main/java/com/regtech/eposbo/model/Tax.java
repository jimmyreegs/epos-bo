package com.regtech.eposbo.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
public class Tax {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private BigDecimal rate;

    public Long getId() { return id;}
    public void setId(Long id) {this.id = id;}
    public String getName() {return name;}
    public void setName(String name) {this.name = name;}
    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}
    public BigDecimal getRate() {return rate;}
    public void setRate(BigDecimal rate) {this.rate = rate;}

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Tax tax = (Tax) o;
        return Objects.equals(id, tax.id) && Objects.equals(name, tax.name) && Objects.equals(description, tax.description) && Objects.equals(rate, tax.rate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, rate);
    }
}