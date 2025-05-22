package dev.shawnspitzel.gradeCategories;

import dev.shawnspitzel.classes.Class_Items;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GradeCategoryRepository extends CrudRepository<GradeCategory, Integer>{
    @Transactional
    void deleteByClasses_Id(Integer classId);
    @Query(
            nativeQuery = true,
            value
                    = "SELECT gc.* FROM grade_category gc INNER JOIN class_items ci ON ci.id = gc.class_items_id WHERE ci.id = :classId;\n")
    List<GradeCategory> findGradeCategoryByClassID(@Param("classId") int classId);

}
