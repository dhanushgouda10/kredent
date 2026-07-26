package com.kredent.backend.service;

import com.kredent.backend.dto.AdminUpdateStudentRequest;
import com.kredent.backend.dto.PageResponse;
import com.kredent.backend.dto.RegisterRequest;
import com.kredent.backend.dto.StudentResponse;
import com.kredent.backend.dto.UpdateStudentProfileRequest;
import com.kredent.backend.entity.ActorType;
import com.kredent.backend.entity.Admin;
import com.kredent.backend.entity.Student;
import com.kredent.backend.repository.StudentRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;
    private final AuditLogService auditLogService;

    public StudentService(
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            CurrentUserService currentUserService,
            AuditLogService auditLogService) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.currentUserService = currentUserService;
        this.auditLogService = auditLogService;
    }

    public StudentResponse getOwnProfile() {
        return StudentResponse.from(currentUserService.getCurrentStudent());
    }

    public StudentResponse updateOwnProfile(UpdateStudentProfileRequest request) {
        Student student = currentUserService.getCurrentStudent();
        student.setFullName(request.getFullName());
        student.setPhone(request.getPhone());
        studentRepository.save(student);
        return StudentResponse.from(student);
    }

    public StudentResponse getByUsn(String usn) {
        Student student = studentRepository.findByUsn(usn)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No student with USN " + usn));
        return StudentResponse.from(student);
    }

    public PageResponse<StudentResponse> listStudents(String search, Pageable pageable) {
        Page<Student> page = (search == null || search.isBlank())
                ? studentRepository.findAll(pageable)
                : studentRepository.search(search.trim(), pageable);
        return PageResponse.from(page, StudentResponse::from);
    }

    public StudentResponse adminCreateStudent(RegisterRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        if (studentRepository.existsByUsn(request.getUsn())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "USN already exists");
        }

        Student student = new Student();
        student.setFullName(request.getFullName());
        student.setUsn(request.getUsn());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setDepartment(request.getDepartment());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        studentRepository.save(student);

        Admin admin = currentUserService.getCurrentAdmin();
        auditLogService.record(
                ActorType.ADMIN,
                admin.getId(),
                "STUDENT_CREATED",
                "STUDENT",
                String.valueOf(student.getId()),
                Map.of("usn", student.getUsn(), "email", student.getEmail())
        );

        return StudentResponse.from(student);
    }

    public StudentResponse adminUpdateStudent(Long studentId, AdminUpdateStudentRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

        if (!student.getEmail().equalsIgnoreCase(request.getEmail()) && studentRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use by another student");
        }

        student.setFullName(request.getFullName());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setDepartment(request.getDepartment());
        studentRepository.save(student);

        Admin admin = currentUserService.getCurrentAdmin();
        auditLogService.record(
                ActorType.ADMIN,
                admin.getId(),
                "STUDENT_UPDATED",
                "STUDENT",
                String.valueOf(student.getId()),
                Map.of("usn", student.getUsn())
        );

        return StudentResponse.from(student);
    }
}
