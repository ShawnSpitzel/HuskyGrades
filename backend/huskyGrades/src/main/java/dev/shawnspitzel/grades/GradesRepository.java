package dev.shawnspitzel.grades;

import dev.shawnspitzel.gradeCategories.GradeCategory;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GradesRepository extends CrudRepository<Grades, Integer> {
    @Transactional
    void deleteByGradeCategory_Id(Integer gradeCategoryId);
    @Query(
            nativeQuery = true,
            value
                    = "SELECT g.* FROM grades g INNER JOIN grade_category gc ON gc.id = g.grade_category_id WHERE gc.id = :gradeCategoryId;\n")
    List<Grades> findGradesByCategoryId(@Param("gradeCategoryId") int gradeCategoryId);

}
