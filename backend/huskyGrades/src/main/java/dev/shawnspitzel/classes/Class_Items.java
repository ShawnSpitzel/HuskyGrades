package dev.shawnspitzel.classes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import dev.shawnspitzel.gradeCategories.GradeCategory;
import dev.shawnspitzel.students.Student;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Getter
@Entity
@Setter
public class Class_Items {
        @Id
        @GeneratedValue (strategy = GenerationType.IDENTITY)
        Integer id;
        Integer credits;
        String className;
        String professorName;
        @ManyToOne
        @JoinColumn(name = "student_id")
        @JsonBackReference
        Student student;
        @OneToMany(mappedBy = "classes" )
        @JsonManagedReference
        List<GradeCategory> categories;
        @Nullable
        Double currentGrade;
        String letterGrade;
        @Nullable
        Double predictedOptimistic;
        String predictedOptimisticLetterGrade;
        @Nullable
        Double predictedPessimistic;
        String predictedPessimisticLetterGrade;

        public Class_Items(){}

        public Class_Items(Integer credits, String className, String professorName, Student student, List<GradeCategory> categories, Double currentGrade, String letterGrade, Double predictedOptimistic, String predictedOptimisticLetterGrade, Double predictedPessimistic, String predictedPessimisticLetterGrade){
                this.credits = credits;
                this.className = className;
                this.professorName = professorName;
                this.student = student;
                this.categories = categories;
                this.currentGrade = currentGrade;
                this.letterGrade = letterGrade;
                this.predictedOptimistic = predictedOptimistic;
                this.predictedOptimisticLetterGrade = predictedOptimisticLetterGrade;
                this.predictedPessimistic = predictedPessimistic;
                this.predictedPessimisticLetterGrade = predictedPessimisticLetterGrade;
        }
}
