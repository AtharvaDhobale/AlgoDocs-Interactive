package com.algovision.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "name", "AlgoVision AI API",
                "version", "1.0.0",
                "docs", "/swagger-ui.html",
                "health", "/actuator/health"
        ));
    }
}
