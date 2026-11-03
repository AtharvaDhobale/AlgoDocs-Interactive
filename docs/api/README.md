# AlgoVision AI — API Documentation

Base URL: `http://localhost:8080/api/v1`

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Authentication Endpoints (Module 2)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login with email/password | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Revoke refresh token | Bearer |
| POST | `/auth/forgot-password` | Send password reset OTP | Public |
| POST | `/auth/reset-password` | Reset password with OTP | Public |
| POST | `/auth/verify-email` | Verify email with OTP | Public |
| GET | `/auth/oauth/google` | Google OAuth redirect | Public |
| GET | `/auth/oauth/github` | GitHub OAuth redirect | Public |

## User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/me` | Get current user profile | Bearer |
| PUT | `/users/me` | Update profile | Bearer |
| POST | `/users/me/avatar` | Upload profile picture | Bearer |
| GET | `/users/me/stats` | Get XP, level, streak | Bearer |

## Visualization Endpoints (Module 4)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/visualizations/data-structures` | List all data structures | Public |
| GET | `/visualizations/{slug}` | Get visualization config | Public |
| POST | `/visualizations` | Save visualization | Bearer |
| GET | `/visualizations/shared/{token}` | Get shared visualization | Public |

## Practice Endpoints (Module 6)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/problems` | List problems (filtered) | Bearer |
| GET | `/problems/{slug}` | Get problem details | Bearer |
| POST | `/problems/{id}/submit` | Submit solution | Bearer |

## AI Tutor Endpoints (Module 7)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ai/chat` | Send message to AI tutor | Bearer |
| GET | `/ai/conversations` | List conversations | Bearer |

## Response Format

```json
{
  "success": true,
  "data": { },
  "message": "Operation successful",
  "timestamp": "2026-07-01T08:00:00Z"
}
```

## Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": []
  },
  "timestamp": "2026-07-01T08:00:00Z"
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Internal Server Error |
