package com.kredent.backend.controller;

import com.kredent.backend.dto.StudentResponse;
import com.kredent.backend.dto.UpdateStudentProfileRequest;
import com.kredent.backend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/me")
    public ResponseEntity<StudentResponse> getOwnProfile() {
        return ResponseEntity.ok(studentService.getOwnProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<StudentResponse> updateOwnProfile(@Valid @RequestBody UpdateStudentProfileRequest request) {
        return ResponseEntity.ok(studentService.updateOwnProfile(request));
    }
}
