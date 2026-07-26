package com.kredent.backend.service;

import com.kredent.backend.entity.Admin;
import com.kredent.backend.entity.Student;
import com.kredent.backend.repository.AdminRepository;
import com.kredent.backend.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Resolves the full Student/Admin entity for the currently authenticated
 * request. This only *reads* the Authentication that JwtAuthFilter already
 * put in the SecurityContext — it doesn't change how authentication works,
 * so JWT/Spring Security itself is untouched.
 *
 * The JWT subject is the student's email or the admin's wallet address (see
 * JwtService/AuthService/AdminAuthService); this class re-resolves that
 * subject to a real entity so services can get an actual id for ownership
 * checks and audit logging.
 */
@Service
public class CurrentUserService {

    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;

    public CurrentUserService(StudentRepository studentRepository, AdminRepository adminRepository) {
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
    }

    public Student getCurrentStudent() {
        String email = currentSubject();
        return studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Student session is no longer valid"));
    }

    public Admin getCurrentAdmin() {
        String wallet = currentSubject();
        return adminRepository.findByWalletAddress(wallet)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Admin session is no longer valid"));
    }

    public boolean isAdmin() {
        return hasAuthority("ROLE_ADMIN");
    }

    public boolean isStudent() {
        return hasAuthority("ROLE_STUDENT");
    }

    private boolean hasAuthority(String authority) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return false;
        }
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority::equals);
    }

    private String currentSubject() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        return auth.getName();
    }
}
