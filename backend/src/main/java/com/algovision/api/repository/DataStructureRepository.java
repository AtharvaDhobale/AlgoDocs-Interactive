package com.algovision.api.repository;

import com.algovision.api.entity.DataStructure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DataStructureRepository extends JpaRepository<DataStructure, Long> {
    Optional<DataStructure> findBySlug(String slug);
    List<DataStructure> findAllByOrderBySortOrderAsc();
}
