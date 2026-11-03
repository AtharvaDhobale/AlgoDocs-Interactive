package com.algovision.api.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    private Integer xp = 0;

    @Builder.Default
    private Integer level = 1;

    @Builder.Default
    private Integer coins = 0;

    @Column(name = "learning_streak")
    @Builder.Default
    private Integer learningStreak = 0;

    @Column(name = "longest_streak")
    @Builder.Default
    private Integer longestStreak = 0;

    @Column(name = "last_active_date")
    private LocalDate lastActiveDate;

    @Column(name = "interview_readiness_score", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal interviewReadinessScore = BigDecimal.ZERO;

    @Column(name = "total_problems_solved")
    @Builder.Default
    private Integer totalProblemsSolved = 0;

    @Column(name = "total_visualizations")
    @Builder.Default
    private Integer totalVisualizations = 0;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
