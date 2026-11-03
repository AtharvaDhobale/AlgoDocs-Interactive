package com.algovision.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataStructureResponse {
    private Long id;
    private String name;
    private String slug;
    private String category;
    private String description;
    private Boolean isPremium;
}
