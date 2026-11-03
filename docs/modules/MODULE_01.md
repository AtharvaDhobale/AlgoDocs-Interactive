# Module 1: Project Foundation & Premium Landing Page

## Deliverables

| Area | Status | Location |
|------|--------|----------|
| Monorepo structure | Done | `/frontend`, `/backend`, `/database`, `/docs`, `/docker` |
| Architecture docs | Done | `docs/architecture/README.md` |
| ER Diagram | Done | `docs/database/ER_DIAGRAM.md` |
| Database schema (32 tables) | Done | `database/schema.sql` |
| Spring Boot API foundation | Done | `backend/` |
| Public REST endpoints | Done | `/api/v1/public/*` |
| Swagger documentation | Done | `/swagger-ui.html` |
| Premium landing page | Done | `frontend/src/app/page.tsx` |
| Docker Compose | Done | `docker-compose.yml` |
| GitHub Actions CI/CD | Done | `.github/workflows/ci.yml` |
| JUnit tests | Done | `PublicControllerTest` |

## Folder Structure

```
algovision-ai/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── login/page.tsx        # Auth placeholder
│   │   │   ├── signup/page.tsx       # Auth placeholder
│   │   │   ├── layout.tsx
│   │   │   └── globals.css           # Design system tokens
│   │   ├── components/
│   │   │   ├── landing/              # Landing page sections
│   │   │   └── ui/                   # Shadcn-style primitives
│   │   └── lib/utils.ts
│   └── package.json
├── backend/
│   └── src/main/java/com/algovision/api/
│       ├── config/                   # Security, CORS, OpenAPI
│       ├── controller/               # PublicController
│       ├── dto/response/             # ApiResponse, DTOs
│       ├── entity/                   # User, Role, DataStructure
│       ├── repository/               # JPA repositories
│       ├── service/                  # PublicService
│       └── exception/                # Global error handling
├── database/schema.sql
├── docs/
├── docker/
└── docker-compose.yml
```

## UI Design

**Theme:** Pure white (#FFFFFF) with soft shadows, rounded corners (12–16px), gradient accents (indigo → violet → pink).

**Landing sections:**
1. Navbar (glassmorphism on scroll)
2. Hero (animated graph canvas, floating DS labels, AVL tree preview)
3. Statistics (animated counters)
4. Companies marquee
5. Features grid (8 cards)
6. Visualization preview (12 DS pills)
7. Learning roadmap timeline
8. Testimonials
9. Pricing (3 tiers — demo)
10. FAQ accordion
11. CTA gradient banner
12. Footer

## API Endpoints (Module 1)

```
GET /api/v1/public/health
GET /api/v1/public/stats
GET /api/v1/public/data-structures
GET /swagger-ui.html
GET /actuator/health
```

## Running Locally

```bash
# Frontend only
cd frontend && npm run dev
# → http://localhost:3000

# Backend only (requires MySQL or use Docker)
cd backend && ./mvnw spring-boot:run
# → http://localhost:8080

# Full stack
docker compose up -d
```

## Testing

```bash
# Frontend
cd frontend && npm run build && npm run lint

# Backend
cd backend && ./mvnw test
```

## Next Module

**Module 2: Authentication & User Management**
- JWT login/register/refresh
- OTP email verification
- Google & GitHub OAuth
- 2FA, profile picture upload
- Role-based routing to dashboards
