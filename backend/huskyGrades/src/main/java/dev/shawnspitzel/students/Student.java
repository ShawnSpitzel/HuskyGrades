package dev.shawnspitzel.students;

import dev.shawnspitzel.classes.Class_Items;
import dev.shawnspitzel.gradeCategories.GradeCategory;
import dev.shawnspitzel.grades.Grades;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Entity
@Setter
public class Student{
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        Integer id;
        String email;
        String password;
        String firstName;
        String lastName;
        String major;
        Integer credits;
        @OneToMany(mappedBy = "student")
        List<Class_Items> classes;
        Double GPA;
        Double optimisticGPA;
        Double pessimisticGPA;

        private Student(){}
        private Student (String firstName, String lastName, String major, Integer credits, List<Class_Items> classes, Double GPA, Double optimisticGPA, Double pessimisticGPA){
                this.firstName = firstName;
                this.lastName = lastName;
                this.major = major;
                this.credits = credits;
                this.classes = classes;
                this.GPA = GPA;
                this.optimisticGPA = optimisticGPA;
                this.pessimisticGPA = pessimisticGPA;
        }
}