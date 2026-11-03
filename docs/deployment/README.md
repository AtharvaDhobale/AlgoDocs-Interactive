# Deployment Architecture

## Production Deployment

```mermaid
graph TB
    subgraph Internet
        USER[Users]
    end

    subgraph Cloud Provider - AWS / GCP / Azure
        subgraph Frontend
            VERCEL[Vercel / S3 + CloudFront]
        end

        subgraph Backend Cluster
            NGINX[Nginx Ingress]
            API1[Spring Boot Pod 1]
            API2[Spring Boot Pod 2]
            API3[Spring Boot Pod N]
        end

        subgraph Data Services
            RDS[(RDS MySQL)]
            ELASTICACHE[(ElastiCache Redis)]
            S3_BUCKET[S3 - Media Storage]
        end

        subgraph CI/CD
            GHA[GitHub Actions]
            ECR[Container Registry]
        end

        subgraph Monitoring
            PROM[Prometheus]
            GRAF[Grafana]
            LOGS[CloudWatch / ELK]
        end
    end

    USER --> VERCEL
    USER --> NGINX
    VERCEL --> NGINX
    NGINX --> API1
    NGINX --> API2
    NGINX --> API3
    API1 --> RDS
    API2 --> RDS
    API3 --> RDS
    API1 --> ELASTICACHE
    API2 --> ELASTICACHE
    API1 --> S3_BUCKET
    GHA --> ECR --> API1
```

## Docker Compose (Local Development)

| Service | Port | Image |
|---------|------|-------|
| frontend | 3000 | node:22-alpine |
| backend | 8080 | eclipse-temurin:21 |
| mysql | 3306 | mysql:8.0 |
| redis | 6379 | redis:7-alpine |

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

### Backend (application.yml)
```
SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/algovision_db
SPRING_REDIS_HOST=redis
JWT_SECRET=<256-bit-secret>
JWT_EXPIRATION=86400000
```

## Deployment Steps

1. **Build**: `docker compose build`
2. **Migrate**: Run `database/schema.sql` against MySQL
3. **Deploy**: `docker compose up -d`
4. **Verify**: Health check at `/actuator/health`

## Scaling Strategy

- **Horizontal**: Add Spring Boot replicas behind load balancer
- **Database**: Read replicas for analytics queries
- **Cache**: Redis cluster for session/leaderboard
- **CDN**: Static assets and visualization exports
