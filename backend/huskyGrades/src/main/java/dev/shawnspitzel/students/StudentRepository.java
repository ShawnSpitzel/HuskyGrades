package dev.shawnspitzel.students;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StudentRepository extends CrudRepository<Student, Integer> {
    @Query(
            nativeQuery = true,
            value
                    = "SELECT id FROM student WHERE email= :email AND password = :password\n")
    Integer findStudentByLogin(@Param("email") String email, @Param("password") String password);
    @Query(
            nativeQuery = true,
            value
                    = "SELECT * FROM student WHERE email= :email\n")
    Optional<Student> isEmailUsed(@Param("email") String email);

}




