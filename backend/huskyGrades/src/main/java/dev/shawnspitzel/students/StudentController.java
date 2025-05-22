package dev.shawnspitzel.students;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class StudentController {

    private final StudentRepository studentRepository;
    public StudentController(StudentRepository studentRepository){
        this.studentRepository = studentRepository;
    }
    @PostMapping("/api/addStudent")
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        if (this.studentRepository.isEmailUsed(student.email).isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already in use");
        } else {
            Student savedStudent = this.studentRepository.save(student);
            return ResponseEntity.ok(savedStudent);
        }
    }
    @GetMapping("/api/students")
    public Iterable<Student> getAllStudents(){
        return this.studentRepository.findAll();
    }
    @PostMapping("/api/loginStudent")
    public ResponseEntity<?> loginStudent(@RequestBody LoginRequest request){
        Integer studentID = this.studentRepository.findStudentByLogin(request.getEmail(), request.getPassword());
        if (studentID == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        } else {
            return ResponseEntity.ok(studentID);
        }
    }

    @GetMapping("/api/findStudent/{id}")
    public Optional<Student> getStudent(@PathVariable Integer id){ return this.studentRepository.findById(id);}

    @DeleteMapping("/api/deleteStudent/{id}")
    void deleteStudent(@PathVariable Integer id) {studentRepository.deleteById(id);
    }
}
