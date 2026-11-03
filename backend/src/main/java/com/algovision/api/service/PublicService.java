package com.algovision.api.service;

import com.algovision.api.dto.response.DataStructureResponse;
import com.algovision.api.dto.response.PlatformStatsResponse;
import com.algovision.api.entity.DataStructure;
import com.algovision.api.repository.DataStructureRepository;
import com.algovision.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicService {

    private final DataStructureRepository dataStructureRepository;
    private final UserRepository userRepository;

    public List<DataStructureResponse> getAllDataStructures() {
        return dataStructureRepository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PlatformStatsResponse getPlatformStats() {
        long userCount = 0;
        try {
            userCount = userRepository.count();
        } catch (Exception ignored) {
            // Fallback for demo / when DB unavailable
        }

        return PlatformStatsResponse.builder()
                .totalUsers(userCount > 0 ? userCount : 50000)
                .totalVisualizations(125000)
                .totalProblems(850)
                .dataStructuresCount(30)
                .algorithmsCount(55)
                .build();
    }

    private DataStructureResponse toResponse(DataStructure ds) {
        return DataStructureResponse.builder()
                .id(ds.getId())
                .name(ds.getName())
                .slug(ds.getSlug())
                .category(ds.getCategory())
                .description(ds.getDescription())
                .isPremium(ds.getIsPremium())
                .build();
    }
}
