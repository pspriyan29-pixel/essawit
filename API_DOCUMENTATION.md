# API Documentation - Web Management Sawit

Base URL: `http://localhost:5000/api`

## Authentication

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "081234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "subscriptionPlan": "free"
    }
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "subscriptionPlan": "free",
      "profilePicture": ""
    }
  }
}
```

### Get Current User
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      ...
    }
  }
}
```

## User Management

### Get User Profile
```http
GET /users/profile
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      ...
    }
  }
}
```

### Update User Profile
```http
PUT /users/profile
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "081234567890",
  "address": "Jl. Example",
  "province": "Jawa Barat",
  "city": "Bandung",
  "plantationArea": 10
}
```

### Change Password
```http
PUT /users/change-password
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password123"
}
```

### Get Dashboard Stats
```http
GET /users/dashboard
```

**Headers:**
```
Authorization: Bearer {token}
```

## Harvest Management

### Create Harvest Record
```http
POST /harvest
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "date": "2024-01-15",
  "periodType": "weekly",
  "income": 5000000,
  "volume": 10,
  "pricePerTon": 500000,
  "location": "Blok A",
  "notes": "Panen pertama"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "harvest": {
      "_id": "harvest_id",
      "date": "2024-01-15",
      "periodType": "weekly",
      "income": 5000000,
      ...
    }
  }
}
```

### Get Harvests
```http
GET /harvest?periodType=weekly&page=1&limit=10
```

**Query Parameters:**
- `periodType` (optional): weekly, monthly, yearly
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### Get Harvest Statistics
```http
GET /harvest/statistics?periodType=monthly&year=2024
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalIncome": 50000000,
    "totalVolume": 100,
    "averagePrice": 500000,
    "totalRecords": 12,
    "monthlyStats": {
      "1": { "income": 5000000, "volume": 10, "count": 1 },
      ...
    },
    "yearlyStats": {
      "2022": { "income": 40000000, "volume": 80, "count": 10 },
      ...
    }
  }
}
```

### Get Harvest by ID
```http
GET /harvest/:id
```

### Update Harvest
```http
PUT /harvest/:id
```

### Delete Harvest
```http
DELETE /harvest/:id
```

## Subscription

### Get Subscription Plans
```http
GET /subscription/plans
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "free": {
      "name": "Gratis",
      "price": 0,
      "duration": null,
      "features": [...]
    },
    "basic": {...},
    "premium": {...},
    "enterprise": {...}
  }
}
```

### Subscribe to Plan
```http
POST /subscription/subscribe
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "plan": "basic"
}
```

### Get My Subscription
```http
GET /subscription/my-subscription
```

## Education

### Get All Educations
```http
GET /education?category=pemupukan&level=pemula&page=1&limit=10
```

### Get Education Detail
```http
GET /education/:id
```

### Update Progress
```http
POST /education/progress
```

**Request Body:**
```json
{
  "educationId": "education_id",
  "progress": 75,
  "completed": false
}
```

### Get My Progress
```http
GET /education/progress/my
```

## Scholarship

### Get All Scholarships
```http
GET /scholarship?isActive=true&page=1&limit=10
```

### Get Scholarship Detail
```http
GET /scholarship/:id
```

### Apply Scholarship
```http
POST /scholarship/:id/apply
```

**Headers:**
```
Authorization: Bearer {token}
```

### Get My Applications
```http
GET /scholarship/applications/my
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "msg": "Validation error",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Status Codes:**
- `400` - Bad Request (Validation Error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Auth endpoints: Same as default

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

Tokens expire after 7 days by default (configurable via `JWT_EXPIRE`).

