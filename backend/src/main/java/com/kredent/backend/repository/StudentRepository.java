package com.kredent.backend.repository;

import com.kredent.backend.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsn(String usn);

    Optional<Student> findByEmail(String email);

    Optional<Student> findByUsn(String usn);

    long countByDepartment(String department);

    @Query("""
            SELECT s FROM Student s
            WHERE LOWER(s.usn) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    Page<Student> search(@Param("query") String query, Pageable pageable);

    // Department-scoped version of search() above — used by the admin Students page once a
    // department filter is selected, so the search itself stays server-side and paginated rather
    // than fetching a department's full roster and filtering client-side.
    @Query("""
            SELECT s FROM Student s
            WHERE s.department = :department
              AND (:query = '' OR
                   LOWER(s.usn) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
                OR LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%')))
            """)
    Page<Student> searchByDepartment(@Param("department") String department, @Param("query") String query, Pageable pageable);

    // Real, DB-computed department-wise counts for the admin Students overview — never
    // hardcoded/invented numbers. Only departments with at least one student actually appear.
    @Query("SELECT s.department, COUNT(s) FROM Student s GROUP BY s.department")
    List<Object[]> countGroupedByDepartment();
}
