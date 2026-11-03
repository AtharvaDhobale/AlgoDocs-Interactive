package com.algovision.api.service;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.algovision.api.dto.request.LoginRequest;
import com.algovision.api.dto.request.SignupRequest;
import com.algovision.api.dto.response.AuthResponse;
import com.algovision.api.entity.Role;
import com.algovision.api.entity.RoleType;
import com.algovision.api.entity.User;
import com.algovision.api.repository.RoleRepository;
import com.algovision.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse signup(SignupRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        Role studentRole = roleRepository.findByName(RoleType.STUDENT)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(RoleType.STUDENT)
                        .description("Student")
                        .build()));

        User user = User.builder()
                .email(email)
                .username(generateUsername(email))
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName() == null ? "" : request.getLastName().trim())
                .role(studentRole)
                .isActive(true)
                .emailVerified(true)
                .build();

        userRepository.save(user);

        String fullName = (user.getFirstName() + " " + user.getLastName()).trim();

        return AuthResponse.builder()
                .token(UUID.randomUUID().toString())
                .email(user.getEmail())
                .name(fullName)
                .role(studentRole.getName().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No account found with this email."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect password.");
        }

        String fullName = (user.getFirstName() + " " + user.getLastName()).trim();

        return AuthResponse.builder()
                .token(UUID.randomUUID().toString())
                .email(user.getEmail())
                .name(fullName.isBlank() ? user.getUsername() : fullName)
                .role(user.getRole().getName().name())
                .build();
    }

    private String generateUsername(String email) {
        String base = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        return base.isBlank() ? "student" : base + "" + UUID.randomUUID().toString().substring(0, 4);
    }
}
