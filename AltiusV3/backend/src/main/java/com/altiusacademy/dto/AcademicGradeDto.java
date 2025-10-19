package com.altiusacademy.dto;

public class AcademicGradeDto {
    private Long id;
    private String name;
    private String description;
    private Integer level;
    
    // Constructors
    public AcademicGradeDto() {}
    
    public AcademicGradeDto(Long id, String name, String description, Integer level) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.level = level;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
}