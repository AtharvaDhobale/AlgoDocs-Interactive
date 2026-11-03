# AlgoVision AI — System Architecture

## High-Level Architecture

```mermaid
graph TB
    subgraph Client Layer
        WEB[Next.js Web App]
        MOB[Future Mobile App]
    end

    subgraph CDN & Edge
        CDN[Vercel / CloudFront CDN]
    end

    subgraph API Gateway
        NGINX[Nginx Reverse Proxy]
        LB[Load Balancer]
    end

    subgraph Application Layer
        API[Spring Boot REST API]
        WS[WebSocket Server]
        AI[AI Tutor Service]
    end

    subgraph Data Layer
        MYSQL[(MySQL 8.0)]
        REDIS[(Redis Cache)]
        S3[Object Storage - Avatars/Exports]
    end

    subgraph External Services
        OAUTH[Google / GitHub OAuth]
        LLM[OpenAI / Claude API]
        JUDGE[Code Execution Engine]
    end

    WEB --> CDN --> NGINX --> LB
    LB --> API
    LB --> WS
    API --> MYSQL
    API --> REDIS
    API --> S3
    API --> OAUTH
    API --> LLM
    API --> JUDGE
    WS --> REDIS
```

## Frontend Architecture

```mermaid
graph LR
    subgraph Next.js App Router
        PAGES[Pages / Layouts]
        COMP[Components]
        STORE[Redux Toolkit]
        RQ[React Query]
    end

    subgraph Visualization Engine
        RF[React Flow]
        D3[D3.js]
        THREE[Three.js]
        GSAP[GSAP Animations]
    end

    subgraph Code Editor
        MONACO[Monaco Editor]
    end

    PAGES --> COMP
    COMP --> STORE
    COMP --> RQ
    COMP --> RF
    COMP --> D3
    COMP --> THREE
    COMP --> MONACO
    RQ --> API_CLIENT[Axios API Client]
```

## Backend Architecture (Layered / Clean)

```mermaid
graph TB
    subgraph Presentation Layer
        CTRL[Controllers / REST]
        WS_CTRL[WebSocket Handlers]
        DTO[DTOs / Validators]
    end

    subgraph Business Layer
        SVC[Services]
        AUTH[Auth Service]
        VIZ[Visualization Service]
        AI_SVC[AI Tutor Service]
    end

    subgraph Persistence Layer
        REPO[Repositories]
        ENTITY[JPA Entities]
        CACHE[Redis Cache]
    end

    CTRL --> SVC
    WS_CTRL --> SVC
    SVC --> REPO
    SVC --> CACHE
    REPO --> ENTITY
```

## Security Architecture

| Layer | Mechanism |
|-------|-----------|
| Authentication | JWT (Access + Refresh tokens) |
| Authorization | Role-Based Access Control (RBAC) |
| API Security | CORS, Rate Limiting, Input Validation |
| Data | BCrypt password hashing, encrypted 2FA secrets |
| Session | Redis-backed token blacklist |

## Role-Based Access Matrix

| Resource | Student | Teacher | Recruiter | Admin |
|----------|---------|---------|-----------|-------|
| Visualizations | CRUD own | Read all | — | CRUD all |
| Practice Problems | Solve | Assign | — | CRUD |
| AI Tutor | Use | Use | — | Configure |
| Analytics | Own | Class | Candidates | Platform |
| User Management | Profile | Students | — | Full |

## Module Dependency Graph

```mermaid
graph TD
    M1[Module 1: Foundation] --> M2[Module 2: Auth]
    M2 --> M3[Module 3: Student Dashboard]
    M2 --> M4[Module 4: DSA Visualizer]
    M4 --> M5[Module 5: Algorithms]
    M3 --> M6[Module 6: Practice]
    M6 --> M7[Module 7: Interview Mode]
    M4 --> M8[Module 8: Code Playground]
    M2 --> M9[Module 9: AI Tutor]
    M3 --> M10[Module 10: Social]
    M2 --> M11[Module 11: Teacher Dashboard]
    M2 --> M12[Module 12: Admin Panel]
```

## Technology Decisions

### Why Next.js 16?
- App Router for nested layouts (role-based dashboards)
- Server Components for SEO on landing/marketing pages
- Built-in API routes for BFF pattern if needed

### Why Spring Boot?
- Enterprise-grade security (Spring Security)
- Mature JPA/Hibernate ORM
- WebSocket support for real-time collaboration
- Excellent testing ecosystem (JUnit, MockMvc)

### Why Redis?
- Session/token caching
- Leaderboard real-time updates
- Rate limiting counters
- WebSocket pub/sub for collaboration

## Non-Functional Requirements

| Requirement | Implementation |
|-------------|----------------|
| Performance | Redis caching, lazy loading, code splitting |
| Scalability | Stateless API, horizontal scaling |
| Security | JWT, RBAC, HTTPS, input sanitization |
| Accessibility | WCAG 2.1 AA, keyboard navigation |
| SEO | SSR landing pages, meta tags, sitemap |
| Monitoring | Spring Actuator, health checks |
