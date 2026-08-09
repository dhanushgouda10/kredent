package com.kredent.backend.service;

import com.kredent.backend.dto.AuthResponse;
import com.kredent.backend.dto.LoginRequest;
import com.kredent.backend.dto.RegisterRequest;
import com.kredent.backend.entity.Role;
import com.kredent.backend.entity.Student;
import com.kredent.backend.repository.StudentRepository;
import com.kredent.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final WalletService walletService;

    public AuthService(
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            WalletService walletService) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.walletService = walletService;
    }

    public void register(RegisterRequest request) {
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

        // Phase 3, "Option B": every student gets a system-managed blockchain wallet the
        // moment their account is created. The student never sees or handles the private key.
        WalletService.GeneratedWallet wallet = walletService.generateWallet();
        student.setWalletAddress(wallet.getAddress());
        student.setWalletPrivateKeyEncrypted(wallet.getEncryptedPrivateKey());

        studentRepository.save(student);
    }

    public AuthResponse login(LoginRequest request) {
        Student student = studentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), student.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtService.generateToken(student.getEmail(), Role.STUDENT.name(), student.getId());
        return new AuthResponse(token, Role.STUDENT.name(), student.getId(), student.getFullName(), student.getEmail());
    }
}
