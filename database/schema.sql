-- AlgoVision AI - Complete Database Schema
-- MySQL 8.0+ | InnoDB | utf8mb4

CREATE DATABASE IF NOT EXISTS algovision_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE algovision_db;

-- ============================================================
-- CORE: Users & Authentication
-- ============================================================

CREATE TABLE roles (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
    email               VARCHAR(255) NOT NULL UNIQUE,
    username            VARCHAR(100) NOT NULL UNIQUE,
    password_hash       VARCHAR(255),
    first_name          VARCHAR(100),
    last_name           VARCHAR(100),
    avatar_url          VARCHAR(500),
    bio                 TEXT,
    role_id             BIGINT NOT NULL,
    email_verified      BOOLEAN DEFAULT FALSE,
    two_factor_enabled  BOOLEAN DEFAULT FALSE,
    two_factor_secret   VARCHAR(255),
    google_id           VARCHAR(255),
    github_id           VARCHAR(255),
    is_active           BOOLEAN DEFAULT TRUE,
    last_login_at       TIMESTAMP NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_users_email (email),
    INDEX idx_users_username (username)
);

CREATE TABLE refresh_tokens (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    token       VARCHAR(500) NOT NULL UNIQUE,
    expires_at  TIMESTAMP NOT NULL,
    revoked     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE otp_verifications (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT,
    email       VARCHAR(255) NOT NULL,
    otp_code    VARCHAR(10) NOT NULL,
    purpose     ENUM('EMAIL_VERIFY', 'PASSWORD_RESET', 'TWO_FACTOR') NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    used        BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- GAMIFICATION: XP, Levels, Badges, Streaks
-- ============================================================

CREATE TABLE user_profiles (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL UNIQUE,
    xp              INT DEFAULT 0,
    level           INT DEFAULT 1,
    coins           INT DEFAULT 0,
    learning_streak INT DEFAULT 0,
    longest_streak  INT DEFAULT 0,
    last_active_date DATE,
    interview_readiness_score DECIMAL(5,2) DEFAULT 0,
    total_problems_solved INT DEFAULT 0,
    total_visualizations  INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE badges (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url    VARCHAR(500),
    xp_required INT DEFAULT 0,
    rarity      ENUM('COMMON', 'RARE', 'EPIC', 'LEGENDARY') DEFAULT 'COMMON',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_badges (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    badge_id    BIGINT NOT NULL,
    earned_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id),
    UNIQUE KEY uk_user_badge (user_id, badge_id)
);

CREATE TABLE achievements (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL,
    achievement_type VARCHAR(100) NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    metadata        JSON,
    earned_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- LEARNING: Roadmaps, Topics, Progress
-- ============================================================

CREATE TABLE roadmaps (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    difficulty      ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') DEFAULT 'BEGINNER',
    estimated_hours INT DEFAULT 0,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE topics (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    roadmap_id  BIGINT,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    category    ENUM('DATA_STRUCTURE', 'ALGORITHM', 'PATTERN', 'SYSTEM_DESIGN') NOT NULL,
    difficulty  ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'EASY',
    sort_order  INT DEFAULT 0,
    content     LONGTEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (roadmap_id) REFERENCES roadmaps(id) ON DELETE SET NULL,
    INDEX idx_topics_slug (slug),
    INDEX idx_topics_category (category)
);

CREATE TABLE user_topic_progress (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL,
    topic_id        BIGINT NOT NULL,
    status          ENUM('LOCKED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'LOCKED',
    progress_pct    DECIMAL(5,2) DEFAULT 0,
    time_spent_sec  INT DEFAULT 0,
    completed_at    TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_topic (user_id, topic_id)
);

-- ============================================================
-- DATA STRUCTURES & VISUALIZATIONS
-- ============================================================

CREATE TABLE data_structures (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL UNIQUE,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    category        VARCHAR(50) NOT NULL,
    description     TEXT,
    time_complexity JSON,
    space_complexity VARCHAR(50),
    operations      JSON,
    is_premium      BOOLEAN DEFAULT FALSE,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE visualizations (
    id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id             BIGINT,
    data_structure_id   BIGINT,
    algorithm_id        BIGINT NULL,
    title               VARCHAR(255),
    config              JSON NOT NULL,
    steps               JSON,
    is_public           BOOLEAN DEFAULT FALSE,
    share_token         VARCHAR(64) UNIQUE,
    view_count          INT DEFAULT 0,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (data_structure_id) REFERENCES data_structures(id)
);

CREATE TABLE visualization_history (
    id                  BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id             BIGINT NOT NULL,
    data_structure_slug VARCHAR(100) NOT NULL,
    operation           VARCHAR(50) NOT NULL,
    input_data          JSON,
    duration_ms         INT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_viz_history_user (user_id, created_at)
);

-- ============================================================
-- PRACTICE: Problems, Submissions, Bookmarks
-- ============================================================

CREATE TABLE problems (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    description     LONGTEXT NOT NULL,
    difficulty      ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    topic_id        BIGINT,
    companies       JSON,
    tags            JSON,
    time_limit_ms   INT DEFAULT 2000,
    memory_limit_mb INT DEFAULT 256,
    acceptance_rate DECIMAL(5,2) DEFAULT 0,
    total_submissions INT DEFAULT 0,
    editorial       LONGTEXT,
    visual_hint     JSON,
    is_published    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id),
    INDEX idx_problems_difficulty (difficulty),
    INDEX idx_problems_slug (slug)
);

CREATE TABLE test_cases (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    problem_id  BIGINT NOT NULL,
    input       TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample   BOOLEAN DEFAULT FALSE,
    sort_order  INT DEFAULT 0,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

CREATE TABLE submissions (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL,
    problem_id      BIGINT NOT NULL,
    language        ENUM('JAVA', 'PYTHON', 'CPP', 'JAVASCRIPT') NOT NULL,
    code            LONGTEXT NOT NULL,
    status          ENUM('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT', 'RUNTIME_ERROR', 'COMPILE_ERROR') DEFAULT 'PENDING',
    runtime_ms      INT,
    memory_kb       INT,
    test_cases_passed INT DEFAULT 0,
    total_test_cases  INT DEFAULT 0,
    ai_feedback     TEXT,
    submitted_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    INDEX idx_submissions_user (user_id, submitted_at)
);

CREATE TABLE bookmarks (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    entity_type ENUM('PROBLEM', 'TOPIC', 'VISUALIZATION', 'NOTE') NOT NULL,
    entity_id   BIGINT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_bookmark (user_id, entity_type, entity_id)
);

-- ============================================================
-- QUIZZES & INTERVIEW MODE
-- ============================================================

CREATE TABLE quizzes (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    title       VARCHAR(255) NOT NULL,
    topic_id    BIGINT,
    quiz_type   ENUM('MCQ', 'FILL_BLANK', 'DRAG_DROP', 'STEP_ARRANGE', 'PREDICT_OUTPUT', 'COMPLEXITY', 'VISUAL') NOT NULL,
    difficulty  ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'EASY',
    time_limit_sec INT DEFAULT 300,
    created_by  BIGINT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE quiz_questions (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    quiz_id     BIGINT NOT NULL,
    question    TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL,
    options     JSON,
    correct_answer JSON NOT NULL,
    explanation TEXT,
    visual_data JSON,
    points      INT DEFAULT 10,
    sort_order  INT DEFAULT 0,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE quiz_attempts (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    quiz_id     BIGINT NOT NULL,
    score       INT DEFAULT 0,
    max_score   INT DEFAULT 0,
    time_taken_sec INT,
    answers     JSON,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

CREATE TABLE interview_sessions (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL,
    problem_id      BIGINT,
    duration_min    INT DEFAULT 45,
    status          ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED') DEFAULT 'SCHEDULED',
    whiteboard_data JSON,
    code_snapshot   LONGTEXT,
    ai_feedback     JSON,
    communication_score DECIMAL(5,2),
    complexity_score    DECIMAL(5,2),
    overall_score       DECIMAL(5,2),
    started_at      TIMESTAMP NULL,
    completed_at    TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problems(id)
);

-- ============================================================
-- AI TUTOR
-- ============================================================

CREATE TABLE ai_conversations (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    title       VARCHAR(255),
    context_type ENUM('GENERAL', 'PROBLEM', 'VISUALIZATION', 'INTERVIEW') DEFAULT 'GENERAL',
    context_id  BIGINT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE ai_messages (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id BIGINT NOT NULL,
    role            ENUM('USER', 'ASSISTANT', 'SYSTEM') NOT NULL,
    content         TEXT NOT NULL,
    metadata        JSON,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
);

-- ============================================================
-- SOCIAL & COLLABORATION
-- ============================================================

CREATE TABLE friendships (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    requester_id BIGINT NOT NULL,
    addressee_id BIGINT NOT NULL,
    status      ENUM('PENDING', 'ACCEPTED', 'BLOCKED') DEFAULT 'PENDING',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (addressee_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_friendship (requester_id, addressee_id)
);

CREATE TABLE communities (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id  BIGINT NOT NULL,
    is_public   BOOLEAN DEFAULT TRUE,
    member_count INT DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE community_members (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    community_id    BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    role            ENUM('MEMBER', 'MODERATOR', 'ADMIN') DEFAULT 'MEMBER',
    joined_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_community_member (community_id, user_id)
);

CREATE TABLE discussions (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    entity_type ENUM('PROBLEM', 'TOPIC', 'COMMUNITY', 'GENERAL') NOT NULL,
    entity_id   BIGINT,
    title       VARCHAR(255) NOT NULL,
    content     TEXT NOT NULL,
    like_count  INT DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    discussion_id   BIGINT NOT NULL,
    user_id         BIGINT NOT NULL,
    parent_id       BIGINT,
    content         TEXT NOT NULL,
    like_count      INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- ============================================================
-- TEACHER & ADMIN
-- ============================================================

CREATE TABLE assignments (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    teacher_id  BIGINT NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    due_date    TIMESTAMP,
    problem_ids JSON,
    quiz_ids    JSON,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE assignment_submissions (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    assignment_id   BIGINT NOT NULL,
    student_id      BIGINT NOT NULL,
    status          ENUM('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'GRADED') DEFAULT 'NOT_STARTED',
    grade           DECIMAL(5,2),
    feedback        TEXT,
    submitted_at    TIMESTAMP NULL,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_assignment_student (assignment_id, student_id)
);

CREATE TABLE system_logs (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    level       ENUM('INFO', 'WARN', 'ERROR', 'DEBUG') NOT NULL,
    message     TEXT NOT NULL,
    metadata    JSON,
    user_id     BIGINT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_logs_level (level, created_at)
);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO roles (name, description) VALUES
    ('STUDENT', 'Learner with access to visualizations, practice, and AI tutor'),
    ('TEACHER', 'Educator who creates assignments and monitors students'),
    ('RECRUITER', 'Recruiter viewing candidate readiness and profiles'),
    ('ADMIN', 'Platform administrator with full access');

INSERT INTO badges (name, description, xp_required, rarity) VALUES
    ('First Steps', 'Complete your first visualization', 0, 'COMMON'),
    ('Array Master', 'Master all array operations', 500, 'RARE'),
    ('Graph Explorer', 'Visualize 10 graph algorithms', 1000, 'RARE'),
    ('DP Champion', 'Solve 25 dynamic programming problems', 2500, 'EPIC'),
    ('Interview Ready', 'Score 80+ on interview readiness', 5000, 'LEGENDARY');

INSERT INTO data_structures (name, slug, category, description, sort_order) VALUES
    ('Array', 'array', 'Linear', 'Fixed-size sequential collection', 1),
    ('Linked List', 'linked-list', 'Linear', 'Dynamic node-based linear structure', 2),
    ('Stack', 'stack', 'Linear', 'LIFO data structure', 3),
    ('Queue', 'queue', 'Linear', 'FIFO data structure', 4),
    ('Binary Search Tree', 'bst', 'Tree', 'Ordered binary tree', 5),
    ('AVL Tree', 'avl-tree', 'Tree', 'Self-balancing binary search tree', 6),
    ('Heap', 'heap', 'Tree', 'Complete binary tree with heap property', 7),
    ('Hash Table', 'hash-table', 'Hash', 'Key-value store with O(1) average access', 8),
    ('Graph', 'graph', 'Graph', 'Vertices and edges representation', 9),
    ('Trie', 'trie', 'Tree', 'Prefix tree for string operations', 10);
