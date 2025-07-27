# Development Workflow - Todo App

## 🚀 **1. Setup Development Environment**

### **Prerequisites:**
```bash
# Node.js 18+
node --version

# PostgreSQL
psql --version

# Git
git --version
```

### **Initial Setup:**
```bash
# Clone project
git clone <repository-url>
cd todo-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start development server
npm run dev
```

## 🔧 **2. Development Process**

### **A. Feature Development Workflow:**

#### **Step 1: Create Feature Branch**
```bash
git checkout -b feature/user-management
git checkout -b feature/todo-categories
git checkout -b feature/advanced-search
```

#### **Step 2: Database Changes**
```bash
# 1. Update Prisma schema
vim prisma/schema.prisma

# 2. Generate migration
npx prisma migrate dev --name add_user_roles

# 3. Update Prisma client
npx prisma generate
```

#### **Step 3: Code Implementation**
```bash
# 1. Create/Update DTOs
touch src/users/dto/create-user.dto.ts

# 2. Create/Update Services
touch src/users/users.service.ts

# 3. Create/Update Controllers
touch src/users/users.controller.ts

# 4. Update Modules
vim src/users/users.module.ts
```

#### **Step 4: Testing**
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

#### **Step 5: Code Quality**
```bash
# Linting
npm run lint

# Format code
npm run format

# Type checking
npx tsc --noEmit
```

#### **Step 6: Commit & Push**
```bash
git add .
git commit -m "feat: add user role management

- Add UserRole enum
- Implement role-based authorization
- Add role validation middleware
- Update user registration with role selection"

git push origin feature/user-management
```

### **B. API Development Workflow:**

#### **1. Authentication Flow:**
```bash
# 1. Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "Password123!"
  }' \
  -c cookies.txt

# 2. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }' \
  -c cookies.txt

# 3. Access protected resource
curl -X GET http://localhost:3000/todos \
  -b cookies.txt
```

#### **2. Todo Management Flow:**
```bash
# 1. Create todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Buy groceries",
    "completed": false
  }'

# 2. Get all todos
curl -X GET http://localhost:3000/todos \
  -b cookies.txt

# 3. Update todo
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "completed": true
  }'

# 4. Delete todo
curl -X DELETE http://localhost:3000/todos/1 \
  -b cookies.txt
```

#### **3. Session Management Flow:**
```bash
# 1. View active sessions
curl -X GET http://localhost:3000/auth/sessions \
  -b cookies.txt

# 2. Refresh token
curl -X POST http://localhost:3000/auth/sessions/refresh \
  -b cookies.txt

# 3. Invalidate specific session
curl -X DELETE http://localhost:3000/auth/sessions/session-id \
  -b cookies.txt

# 4. Logout (invalidate all sessions)
curl -X POST http://localhost:3000/auth/logout \
  -b cookies.txt
```

## 🧪 **3. Testing Workflow**

### **A. Unit Testing:**
```bash
# Run all tests
npm run test

# Run specific test file
npm run test src/auth/auth.service.spec.ts

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### **B. E2E Testing:**
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in watch mode
npm run test:e2e -- --watch
```

### **C. API Testing:**
```bash
# Using curl for manual testing
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User", "password": "password123"}'

# Using Postman/Insomnia for GUI testing
# Import the provided collection
```

## 🔍 **4. Debugging Workflow**

### **A. Development Debugging:**
```bash
# Start with debug mode
npm run debug

# Or use VS Code debugger
# Add breakpoints in VS Code
# Press F5 to start debugging
```

### **B. Database Debugging:**
```bash
# View database schema
npx prisma db pull

# Open Prisma Studio
npx prisma studio

# Check migration status
npx prisma migrate status
```

### **C. Logging:**
```typescript
// Add logging in services
import { Logger } from '@nestjs/common';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  async create(todo: CreateTodoDto) {
    this.logger.log(`Creating todo: ${todo.title}`);
    // ... implementation
  }
}
```

## 🚀 **5. Deployment Workflow**

### **A. Staging Deployment:**
```bash
# 1. Build application
npm run build

# 2. Run tests
npm run test
npm run test:e2e

# 3. Check code quality
npm run lint
npm run format

# 4. Deploy to staging
docker build -t todo-app:staging .
docker run -p 3000:3000 todo-app:staging
```

### **B. Production Deployment:**
```bash
# 1. Create production build
npm run build

# 2. Run security checks
npm audit
npm audit fix

# 3. Deploy with environment variables
DATABASE_URL="production-db-url" \
JWT_SECRET="production-secret" \
NODE_ENV="production" \
npm run start:prod
```

## 📊 **6. Monitoring Workflow**

### **A. Application Monitoring:**
```bash
# Check application health
curl http://localhost:3000/health

# Monitor logs
tail -f logs/app.log

# Check database connections
npx prisma studio
```

### **B. Security Monitoring:**
```bash
# Check for failed login attempts
# Monitor session activity
# Review audit logs
```

## 🔄 **7. Git Workflow**

### **A. Branch Strategy:**
```
main (production)
├── develop (staging)
├── feature/user-management
├── feature/todo-categories
├── bugfix/login-issue
└── hotfix/security-patch
```

### **B. Commit Convention:**
```bash
# Feature commits
git commit -m "feat: add user role management"

# Bug fixes
git commit -m "fix: resolve login authentication issue"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor: improve auth service performance"

# Testing
git commit -m "test: add unit tests for user service"
```

### **C. Pull Request Process:**
1. **Create PR** from feature branch to develop
2. **Add description** with changes and testing steps
3. **Request review** from team members
4. **Address feedback** and make changes
5. **Merge** after approval
6. **Delete** feature branch after merge

## 🛠️ **8. Common Commands Reference**

### **Development:**
```bash
# Start development server
npm run dev

# Build application
npm run build

# Start production server
npm run start:prod
```

### **Database:**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### **Testing:**
```bash
# Run all tests
npm run test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

### **Code Quality:**
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npx tsc --noEmit
```

## 📝 **9. Checklist trước khi deploy**

- [ ] All tests passing
- [ ] Code linted and formatted
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security audit completed
- [ ] Performance tested
- [ ] Documentation updated
- [ ] Backup created
- [ ] Rollback plan ready 