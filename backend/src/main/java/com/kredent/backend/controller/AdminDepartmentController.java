package com.kredent.backend.controller;

import com.kredent.backend.dto.DepartmentResponse;
import com.kredent.backend.dto.DepartmentSummaryResponse;
import com.kredent.backend.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Admin-only (enforced by SecurityConfig's existing /api/admin/** rule). Backs the department
 * pickers and per-department dashboard strip across the Students and Certificate Registry pages.
 * Read-only — the department catalog itself is a fixed list (see DepartmentCatalog); this
 * controller only ever reports real counts against it.
 */
@RestController
@RequestMapping("/api/admin/departments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminDepartmentController {

    private final DepartmentService departmentService;

    public AdminDepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> listDepartments() {
        return ResponseEntity.ok(departmentService.listDepartments());
    }

    @GetMapping("/{code}/summary")
    public ResponseEntity<DepartmentSummaryResponse> getSummary(@PathVariable String code) {
        return ResponseEntity.ok(departmentService.getSummary(code));
    }
}
