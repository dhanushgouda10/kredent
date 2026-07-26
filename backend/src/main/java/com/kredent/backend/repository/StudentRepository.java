package com.kredent.backend.repository;

import com.kredent.backend.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsn(String usn);

    Optional<Student> findByEmail(String email);

    Optional<Student> findByUsn(String usn);

    @Query("""
            SELECT s FROM Student s
            WHERE LOWER(s.usn) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.fullName) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%'))
            """)
    Page<Student> search(@Param("query") String query, Pageable pageable);
}
