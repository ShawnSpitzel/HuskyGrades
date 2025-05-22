package dev.shawnspitzel.gradeCategories;

import com.fasterxml.jackson.annotation.JsonBackReference;
import dev.shawnspitzel.classes.Class_Items;
import dev.shawnspitzel.grades.Grades;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class GradeCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    String title;
    Integer weight;
    Integer average;
    @ManyToOne
    @JoinColumn(name = "class_items_id")
    @JsonBackReference
    Class_Items classes;
    @OneToMany(mappedBy = "gradeCategory")
    List<Grades> items;

    public GradeCategory(){}
    public GradeCategory(String title, Integer weight, Integer average, List<Grades> items, Class_Items classes){
        this.title = title;
        this.weight = weight;
        this.average = average;
        this.items = items;
        this.classes = classes;
    }

}
