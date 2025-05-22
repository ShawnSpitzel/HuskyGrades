package dev.shawnspitzel.grades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import dev.shawnspitzel.gradeCategories.GradeCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Grades {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    String name;
    Integer grade;
    @ManyToOne
    @JoinColumn(name = "gradeCategory_id")
    @JsonBackReference
    GradeCategory gradeCategory;

    private Grades(){}

    private Grades(String name, Integer grade, GradeCategory gradeCategory){
        this.name = name;
        this.grade = grade;
        this.gradeCategory = gradeCategory;
    }

    public GradeCategory gradeCategory(){
        return this.gradeCategory;
    }

}
