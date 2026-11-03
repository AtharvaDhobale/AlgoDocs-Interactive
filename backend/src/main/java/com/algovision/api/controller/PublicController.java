package com.algovision.api.controller;

import com.algovision.api.dto.response.ApiResponse;
import com.algovision.api.dto.response.DataStructureResponse;
import com.algovision.api.dto.response.PlatformStatsResponse;
import com.algovision.api.service.PublicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
@Tag(name = "Public", description = "Public endpoints for landing page and unauthenticated access")
public class PublicController {

    private final PublicService publicService;

    @GetMapping("/data-structures")
    @Operation(summary = "List all data structures")
    public ResponseEntity<ApiResponse<List<DataStructureResponse>>> getDataStructures() {
        return ResponseEntity.ok(ApiResponse.ok(publicService.getAllDataStructures()));
    }

    @GetMapping("/stats")
    @Operation(summary = "Get platform statistics for landing page")
    public ResponseEntity<ApiResponse<PlatformStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(publicService.getPlatformStats()));
    }

    @GetMapping("/health")
    @Operation(summary = "API health check")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.ok("AlgoVision API is running", "Healthy"));
    }
}
