package dev.shawnspitzel.classes;

import dev.shawnspitzel.gradeCategories.GradeCategory;
import dev.shawnspitzel.gradeCategories.GradeCategoryRepository;
import dev.shawnspitzel.grades.Grades;
import dev.shawnspitzel.grades.GradesRepository;
import dev.shawnspitzel.students.Student;
import dev.shawnspitzel.students.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ClassController {

    private final ClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final GradeCategoryRepository gradeCategoryRepository;
    private final GradesRepository gradesRepository;
    public ClassController(ClassRepository classRepository, StudentRepository studentRepository, GradeCategoryRepository gradeCategoryRepository, GradesRepository gradesRepository){
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.gradeCategoryRepository = gradeCategoryRepository;
        this.gradesRepository = gradesRepository;
    }

    @PostMapping("/api/addClass")
    public Class_Items addClass(@RequestBody Class_Items classes) {
        return this.classRepository.save(classes);
    }

    @PostMapping("/api/addStudentClass/{id}")
    public Class_Items addStudentClass(@PathVariable Integer id, @RequestBody Class_Items classes) {
        Student student = studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));;
        classes.setStudent(student);
        return classRepository.save(classes);
    }
    @GetMapping("/api/classes")
    public Iterable <Class_Items> getAllClasses(){
        return this.classRepository.findAll();
    }
    @GetMapping("/api/classes/{id}")
    public Iterable<Class_Items> getStudentClasses(@PathVariable Integer id){
        return this.classRepository.findClassByStudentID(id);
    }
    @PutMapping("/api/classes/{id}/update")
    public Class_Items updateStudentClass(@PathVariable Integer id, @RequestBody Class_Items classes){
        Class_Items selectedClass = classRepository.findById(id).orElseThrow(() -> new RuntimeException("Class not found"));
        selectedClass.setClassName(classes.getClassName());
        selectedClass.setProfessorName(classes.getProfessorName());
        selectedClass.setCredits(classes.getCredits());
        selectedClass.setCurrentGrade(classes.getCurrentGrade());
        selectedClass.setLetterGrade(classes.getLetterGrade());
        selectedClass.setPredictedOptimisticLetterGrade(classes.getPredictedOptimisticLetterGrade());
        selectedClass.setPredictedPessimisticLetterGrade(classes.getPredictedPessimisticLetterGrade());
        selectedClass.setPredictedOptimistic(classes.getPredictedOptimistic());
        selectedClass.setPredictedPessimistic(classes.getPredictedPessimistic());
        return classRepository.save(selectedClass);
    }
    private void deleteCategoryAndGrades(Integer categoryId) {
        GradeCategory gradeCategory = gradeCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("GradeCategory not found with ID: " + categoryId));
        List<Grades> itemsToDelete = gradesRepository.findGradesByCategoryId(categoryId);
        if (!itemsToDelete.isEmpty()) {
            gradesRepository.deleteAll(itemsToDelete);
        }
        gradeCategoryRepository.deleteById(categoryId);
    }
    @DeleteMapping("/api/deleteClass/{id}")
    void deleteClass(@PathVariable Integer id) {
        Class_Items classItems = classRepository.findById(id).orElseThrow(() -> new RuntimeException("Class not found with ID: " + id));
        List<GradeCategory> gradeCategoriesToDelete = gradeCategoryRepository.findGradeCategoryByClassID(id);
        for (GradeCategory gradeCategory : gradeCategoriesToDelete){
            deleteCategoryAndGrades(gradeCategory.getId());
        }
        classRepository.deleteById(id);
    }
}
