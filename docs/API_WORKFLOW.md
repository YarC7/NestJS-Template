# API Workflow Documentation

## 🔐 **Authentication Workflow**

### **1. User Registration**
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "Password123!"
}

# Response
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-07-27T10:00:00.000Z"
  },
  "message": "Registration successful"
}

# Cookies set automatically:
# - access_token (15 minutes)
# - refresh_token (7 days)
```

### **2. User Login**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}

# Response
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "message": "Login successful"
}
```

### **3. Token Refresh**
```bash
POST /auth/sessions/refresh
# Uses refresh_token from cookies

# Response
{
  "message": "Token refreshed successfully"
}
```

### **4. User Logout**
```bash
POST /auth/logout
# Clears all cookies and invalidates sessions

# Response
{
  "message": "Logout successful"
}
```

## 📝 **Todo Management Workflow**

### **1. Create Todo**
```bash
POST /todos
Content-Type: application/json
# Requires authentication

{
  "title": "Buy groceries",
  "completed": false
}

# Response
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2025-07-27T10:00:00.000Z",
  "userId": 1
}
```

### **2. Get All Todos**
```bash
GET /todos
# Requires authentication
# Returns only user's todos

# Response
[
  {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2025-07-27T10:00:00.000Z",
    "userId": 1
  },
  {
    "id": 2,
    "title": "Call mom",
    "completed": true,
    "createdAt": "2025-07-27T09:00:00.000Z",
    "userId": 1
  }
]
```

### **3. Get Single Todo**
```bash
GET /todos/1
# Requires authentication
# Returns 404 if todo doesn't belong to user

# Response
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2025-07-27T10:00:00.000Z",
  "userId": 1
}
```

### **4. Update Todo**
```bash
PUT /todos/1
Content-Type: application/json
# Requires authentication

{
  "title": "Buy groceries and milk",
  "completed": true
}

# Response
{
  "id": 1,
  "title": "Buy groceries and milk",
  "completed": true,
  "createdAt": "2025-07-27T10:00:00.000Z",
  "userId": 1
}
```

### **5. Delete Todo**
```bash
DELETE /todos/1
# Requires authentication

# Response
{
  "message": "Todo with ID 1 has been deleted"
}
```

## 👤 **Session Management Workflow**

### **1. View Active Sessions**
```bash
GET /auth/sessions
# Requires authentication

# Response
[
  {
    "id": "session-id-1",
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.100",
    "createdAt": "2025-07-27T10:00:00.000Z",
    "expiresAt": "2025-08-03T10:00:00.000Z"
  },
  {
    "id": "session-id-2",
    "userAgent": "PostmanRuntime/7.32.3",
    "ipAddress": "192.168.1.101",
    "createdAt": "2025-07-27T09:00:00.000Z",
    "expiresAt": "2025-08-03T09:00:00.000Z"
  }
]
```

### **2. Invalidate Specific Session**
```bash
DELETE /auth/sessions/session-id-1
# Requires authentication

# Response
{
  "message": "Session invalidated"
}
```

### **3. Invalidate All Sessions**
```bash
DELETE /auth/sessions
# Requires authentication

# Response
{
  "message": "All sessions invalidated"
}
```

## 🔍 **Error Handling Workflow**

### **1. Authentication Errors**
```bash
# Invalid credentials
POST /auth/login
{
  "email": "wrong@example.com",
  "password": "wrongpassword"
}

# Response (401 Unauthorized)
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### **2. Authorization Errors**
```bash
# Access without authentication
GET /todos

# Response (401 Unauthorized)
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### **3. Validation Errors**
```bash
# Invalid email format
POST /auth/register
{
  "email": "invalid-email",
  "name": "John",
  "password": "123"
}

# Response (400 Bad Request)
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### **4. Resource Not Found**
```bash
# Todo doesn't exist or doesn't belong to user
GET /todos/999

# Response (404 Not Found)
{
  "statusCode": 404,
  "message": "Todo with ID 999 not found",
  "error": "Not Found"
}
```

## 🛡️ **Security Workflow**

### **1. Cookie Security**
```bash
# All cookies are HttpOnly, Secure, and SameSite=strict
# Access token: 15 minutes
# Refresh token: 7 days
# Automatic token refresh
```

### **2. CORS Configuration**
```bash
# Allowed origins: FRONTEND_URL or http://localhost:3000
# Credentials: true
# Methods: GET, POST, PUT, DELETE
# Headers: Content-Type, Authorization
```

### **3. Rate Limiting (Planned)**
```bash
# Login attempts: 5 per minute
# API requests: 100 per minute per user
# Registration: 3 per hour per IP
```

## 📊 **Testing Workflow**

### **1. Manual Testing with curl**
```bash
# Complete workflow test
#!/bin/bash

# 1. Register user
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User", "password": "password123"}' \
  -c cookies.txt)

echo "Register response: $REGISTER_RESPONSE"

# 2. Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' \
  -c cookies.txt)

echo "Login response: $LOGIN_RESPONSE"

# 3. Create todo
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title": "Test todo", "completed": false}')

echo "Create todo response: $CREATE_RESPONSE"

# 4. Get todos
GET_RESPONSE=$(curl -s -X GET http://localhost:3000/todos -b cookies.txt)
echo "Get todos response: $GET_RESPONSE"

# 5. Logout
LOGOUT_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/logout -b cookies.txt)
echo "Logout response: $LOGOUT_RESPONSE"
```

### **2. Automated Testing**
```bash
# Run all tests
npm run test

# Run specific test suite
npm run test -- --testNamePattern="Auth"

# Run E2E tests
npm run test:e2e
```

## 🔄 **Development Workflow**

### **1. Adding New Endpoint**
```bash
# 1. Create DTO
touch src/todos/dto/search-todos.dto.ts

# 2. Update service
vim src/todos/todo.service.ts

# 3. Update controller
vim src/todos/todo.controller.ts

# 4. Add tests
touch src/todos/todo.controller.spec.ts

# 5. Update documentation
vim API_WORKFLOW.md
```

### **2. Database Changes**
```bash
# 1. Update schema
vim prisma/schema.prisma

# 2. Generate migration
npx prisma migrate dev --name add_todo_categories

# 3. Update client
npx prisma generate

# 4. Update services
vim src/todos/todo.service.ts
```

### **3. Security Updates**
```bash
# 1. Add new guard
touch src/auth/guards/admin.guard.ts

# 2. Update decorators
vim src/auth/decorators/roles.decorator.ts

# 3. Update controllers
vim src/todos/todo.controller.ts

# 4. Add tests
npm run test
```

## 📈 **Monitoring Workflow**

### **1. Health Checks**
```bash
# Application health
curl http://localhost:3000/health

# Database health
curl http://localhost:3000/health/db

# Auth service health
curl http://localhost:3000/health/auth
```

### **2. Performance Monitoring**
```bash
# Response times
curl -w "@curl-format.txt" http://localhost:3000/todos

# Memory usage
node --inspect src/main.ts

# Database queries
npx prisma studio
```

### **3. Security Monitoring**
```bash
# Failed login attempts
grep "Invalid credentials" logs/auth.log

# Suspicious activity
grep "Multiple sessions" logs/security.log

# Rate limiting violations
grep "Rate limit exceeded" logs/security.log
``` 