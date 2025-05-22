package dev.shawnspitzel.grades;

import dev.shawnspitzel.classes.Class_Items;
import dev.shawnspitzel.gradeCategories.GradeCategory;
import dev.shawnspitzel.gradeCategories.GradeCategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class GradesController {
    private final GradesRepository gradesRepository;
    private final GradeCategoryRepository gradeCategoryRepository;
    public GradesController(GradesRepository gradesRepository, GradeCategoryRepository gradeCategoryRepository){
        this.gradesRepository = gradesRepository;
        this.gradeCategoryRepository = gradeCategoryRepository;
    }
    @PostMapping("/api/addGradeItem/{id}")
    public Grades addGrade(@PathVariable Integer id, @RequestBody Grades grade) {
        GradeCategory selectedGradeCategory = gradeCategoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Grade Category not found"));
        grade.setGradeCategory(selectedGradeCategory);
        return this.gradesRepository.save(grade);
    }
    @GetMapping("/api/grades/{id}")
    public Iterable <Grades> getAllGrades(){
        return this.gradesRepository.findAll();
    }

    @PutMapping("/api/grades/{id}/update")
    public ResponseEntity<?> updateGrades(@PathVariable Integer id, @RequestBody List<Grades> newGrades) {
        GradeCategory associatedGradeCategory = gradeCategoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Grade Category not found with ID: " + id));
        List<Grades> existingGrades = gradesRepository.findGradesByCategoryId(id);
        Set<Integer> incomingGradesIds = new HashSet<>();
        for (Grades grade : newGrades) {
            grade.setGradeCategory(associatedGradeCategory);
            if (grade.getId() != null) {
                Grades existingGrade = existingGrades.stream()
                        .filter(c -> c.getId().equals(grade.getId()))
                        .findFirst()
                        .orElse(null);
                if (existingGrade != null) {
                    existingGrade.setId(grade.getId());
                    existingGrade.setGradeCategory(grade.getGradeCategory());
                    existingGrade.setGrade(grade.getGrade());
                    existingGrade.setName(grade.getName());
                    gradesRepository.save(existingGrade);
                } else {
                    gradesRepository.save(grade);
                }
            } else {
                gradesRepository.save(grade);
            }
            incomingGradesIds.add(grade.getId());
        }
        existingGrades.stream()
                .filter(existingGrade -> !incomingGradesIds.contains(existingGrade.getId()))
                .forEach(gradesRepository::delete);
        List<Grades> updatedGrades = gradesRepository.findGradesByCategoryId(id);
        return ResponseEntity.ok(updatedGrades);
    }
    @GetMapping("/api/gradesById/{id}")
    public Iterable <Grades> getGradeById(@PathVariable Integer id){
        return this.gradesRepository.findGradesByCategoryId(id);
    }

    @DeleteMapping("/api/deleteGrade/{id}")
    void deleteGrade(@PathVariable Integer id) {gradesRepository.deleteById(id);
    }
}
