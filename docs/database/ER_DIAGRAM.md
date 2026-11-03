# AlgoVision AI — Entity Relationship Diagram

## Core ER Diagram

```mermaid
erDiagram
    ROLES ||--o{ USERS : has
    USERS ||--|| USER_PROFILES : has
    USERS ||--o{ REFRESH_TOKENS : owns
    USERS ||--o{ USER_BADGES : earns
    BADGES ||--o{ USER_BADGES : awarded
    USERS ||--o{ ACHIEVEMENTS : unlocks

    ROADMAPS ||--o{ TOPICS : contains
    TOPICS ||--o{ USER_TOPIC_PROGRESS : tracked_by
    USERS ||--o{ USER_TOPIC_PROGRESS : progresses

    DATA_STRUCTURES ||--o{ VISUALIZATIONS : visualized_in
    USERS ||--o{ VISUALIZATIONS : creates
    USERS ||--o{ VISUALIZATION_HISTORY : logs

    TOPICS ||--o{ PROBLEMS : categorizes
    PROBLEMS ||--o{ TEST_CASES : has
    USERS ||--o{ SUBMISSIONS : submits
    PROBLEMS ||--o{ SUBMISSIONS : receives
    USERS ||--o{ BOOKMARKS : saves

    TOPICS ||--o{ QUIZZES : contains
    QUIZZES ||--o{ QUIZ_QUESTIONS : has
    USERS ||--o{ QUIZ_ATTEMPTS : attempts
    USERS ||--o{ INTERVIEW_SESSIONS : conducts

    USERS ||--o{ AI_CONVERSATIONS : chats
    AI_CONVERSATIONS ||--o{ AI_MESSAGES : contains

    USERS ||--o{ FRIENDSHIPS : connects
    COMMUNITIES ||--o{ COMMUNITY_MEMBERS : has
    USERS ||--o{ COMMUNITY_MEMBERS : joins
    USERS ||--o{ DISCUSSIONS : posts
    DISCUSSIONS ||--o{ COMMENTS : has

    USERS ||--o{ ASSIGNMENTS : creates
    ASSIGNMENTS ||--o{ ASSIGNMENT_SUBMISSIONS : receives

    ROLES {
        bigint id PK
        varchar name UK
        varchar description
    }

    USERS {
        bigint id PK
        varchar email UK
        varchar username UK
        varchar password_hash
        bigint role_id FK
        boolean email_verified
        boolean two_factor_enabled
        varchar google_id
        varchar github_id
    }

    USER_PROFILES {
        bigint id PK
        bigint user_id FK UK
        int xp
        int level
        int coins
        int learning_streak
        decimal interview_readiness_score
    }

    TOPICS {
        bigint id PK
        varchar title
        varchar slug UK
        enum category
        enum difficulty
    }

    PROBLEMS {
        bigint id PK
        varchar title
        varchar slug UK
        enum difficulty
        bigint topic_id FK
        json companies
        json tags
    }

    VISUALIZATIONS {
        bigint id PK
        bigint user_id FK
        bigint data_structure_id FK
        json config
        json steps
        varchar share_token UK
    }

    SUBMISSIONS {
        bigint id PK
        bigint user_id FK
        bigint problem_id FK
        enum language
        longtext code
        enum status
    }
```

## Table Count Summary

| Domain | Tables |
|--------|--------|
| Auth & Users | 4 |
| Gamification | 4 |
| Learning | 3 |
| Visualization | 3 |
| Practice | 4 |
| Quiz & Interview | 4 |
| AI Tutor | 2 |
| Social | 5 |
| Teacher/Admin | 3 |
| **Total** | **32** |

See [schema.sql](../../database/schema.sql) for full DDL.
