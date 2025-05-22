package dev.shawnspitzel.gradeCategories;
import dev.shawnspitzel.classes.ClassRepository;
import dev.shawnspitzel.classes.Class_Items;
import dev.shawnspitzel.grades.Grades;
import dev.shawnspitzel.grades.GradesRepository;
import dev.shawnspitzel.students.Student;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
public class GradeCategoryController {
    private final GradeCategoryRepository gradeCategoryRepository;
    private final ClassRepository classRepository;
    private final GradesRepository gradesRepository;
    public GradeCategoryController(GradeCategoryRepository gradeCategoryRepository, ClassRepository classRepository, GradesRepository gradesRepository){
        this.gradeCategoryRepository = gradeCategoryRepository;
        this.classRepository = classRepository;
        this.gradesRepository = gradesRepository;
    }
    @PostMapping("/api/addGradeCategory/{id}")
    public GradeCategory addGradeCategory(@PathVariable Integer id, @RequestBody GradeCategory gradeCategory) {
        Class_Items selectedClass = classRepository.findById(id).orElseThrow(() -> new RuntimeException("Class not found"));
        gradeCategory.setClasses(selectedClass);
        return gradeCategoryRepository.save(gradeCategory);
    }
    @GetMapping("/api/gradeCategory/{id}")
    public Iterable<GradeCategory> getGradeCategoryByClass(@PathVariable Integer id){
        return this.gradeCategoryRepository.findGradeCategoryByClassID(id);
    }
    @PutMapping("/api/gradeCategory/{id}/update")
    public ResponseEntity<?> updateGradeCategories(@PathVariable Integer id, @RequestBody List<GradeCategory> newCategories) {
        Class_Items associatedClass = classRepository.findById(id).orElseThrow(() -> new RuntimeException("Class not found with ID: " + id));
        List<GradeCategory> existingCategories = gradeCategoryRepository.findGradeCategoryByClassID(id);
        Set<Integer> incomingCategoryIds = new HashSet<>();
        for (GradeCategory category : newCategories) {
            category.setClasses(associatedClass);
            if (category.getId() != null) {
                GradeCategory existingCategory = existingCategories.stream()
                        .filter(c -> c.getId().equals(category.getId()))
                        .findFirst()
                        .orElse(null);
                if (existingCategory != null) {
                    existingCategory.setId(category.getId());
                    existingCategory.setTitle(category.getTitle());
                    existingCategory.setClasses(category.getClasses());
                    existingCategory.setWeight(category.getWeight());
                    existingCategory.getItems().clear();
                    for (Grades item : category.getItems()) {
                        item.setGradeCategory(existingCategory);
                        existingCategory.getItems().add(item);
                    }
                    existingCategory.setAverage(category.getAverage());
                    gradeCategoryRepository.save(existingCategory);
                } else {
                    gradeCategoryRepository.save(category);
                }
            } else {
                gradeCategoryRepository.save(category);
            }
            incomingCategoryIds.add(category.getId());
        }
        existingCategories.stream()
                .filter(existingCategory -> !incomingCategoryIds.contains(existingCategory.getId()))
                .forEach(gradeCategoryRepository::delete);
        List<GradeCategory> updatedCategories = gradeCategoryRepository.findGradeCategoryByClassID(id);
        return ResponseEntity.ok(updatedCategories);
    }
    @GetMapping("/api/gradeCategories")
    public Iterable <GradeCategory> getAllGradeCategories(){
        return this.gradeCategoryRepository.findAll();
    }
    @DeleteMapping("/api/deleteGradeCategory/{id}")
    public void deleteGradeCategory(@PathVariable Integer id) {
        GradeCategory gradeCategory = gradeCategoryRepository.findById(id).orElseThrow(() -> new RuntimeException("GradeCategory not found with ID: " + id));
        List<Grades> itemsToDelete = gradesRepository.findGradesByCategoryId(id);
        gradesRepository.deleteAll(itemsToDelete);
        gradeCategoryRepository.deleteById(id);
    }


}
