package dev.shawnspitzel.classes;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;



public interface ClassRepository extends CrudRepository<Class_Items, Integer>{
    @Query(
            nativeQuery = true,
            value
                    = "SELECT ci.* FROM class_items ci INNER JOIN student s ON s.id = ci.student_id WHERE s.id = :studentId;\n")
    Iterable<Class_Items> findClassByStudentID(@Param("studentId") int studentId);
}
