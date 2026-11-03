package com.algovision.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.algovision.api.dto.request.SignupRequest;
import com.algovision.api.dto.response.ApiResponse;
import com.algovision.api.dto.response.AuthResponse;
import com.algovision.api.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Student-friendly signup and login endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    @Operation(summary = "Create a student account")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@Valid @RequestBody SignupRequest request) {
        try {
            AuthResponse authResponse = authService.signup(request);
            return ResponseEntity.ok(ApiResponse.<AuthResponse>ok(authResponse, "Account created successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.<AuthResponse>builder().success(false).message(ex.getMessage()).build());
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Log in to a student account")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody com.algovision.api.dto.request.LoginRequest request) {
        try {
            AuthResponse authResponse = authService.login(request);
            return ResponseEntity.ok(ApiResponse.<AuthResponse>ok(authResponse, "Login successful"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ApiResponse.<AuthResponse>builder().success(false).message(ex.getMessage()).build());
        }
    }
}
