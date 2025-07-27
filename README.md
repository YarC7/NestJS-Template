# Todo App Backend

A secure, modern Todo API built with [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), JWT authentication, session management, and [CASL](https://casl.js.org/) for authorization.

---

## 🚀 Features
- **NestJS**: Modular, scalable Node.js framework
- **Prisma**: Type-safe PostgreSQL ORM
- **JWT Auth**: Secure login, registration, and session management
- **Refresh Token & Session**: HttpOnly cookies, multi-device support
- **CASL**: Role-based and resource-level authorization
- **Swagger**: API documentation (optional)
- **ESLint/Prettier**: Code quality and formatting
- **Security**: Secure headers, CORS, bcrypt password hashing

---

## 🛠️ Setup

### 1. **Clone & Install**
```bash
git clone <your-repo-url>
cd todo-app
npm install
```

### 2. **Configure Environment**
Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
```

### 3. **Setup Database**
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio # (optional, for DB UI)
```

### 4. **Run the App**
```bash
npm run start:dev
# or
npm run start
```

App will run at: [http://localhost:3000](http://localhost:3000)

---

## 📚 API Overview

### **Auth**
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login, receive JWT & refresh token (cookies)
- `GET /auth/profile` — Get current user info (JWT required)
- `POST /auth/logout` — Logout, clear cookies

### **Session**
- `GET /auth/sessions` — List active sessions
- `POST /auth/sessions/refresh` — Refresh access token
- `DELETE /auth/sessions/:sessionId` — Invalidate session
- `DELETE /auth/sessions` — Invalidate all sessions

### **Todos**
- `GET /todos` — List your todos
- `POST /todos` — Create todo
- `GET /todos/:id` — Get single todo
- `PUT /todos/:id` — Update todo
- `DELETE /todos/:id` — Delete todo

> All /todos endpoints require authentication and enforce CASL permissions.

---

## 🔐 Security
- **JWT**: Access token (15m), refresh token (7d), both in HttpOnly cookies
- **Password**: Hashed with bcrypt
- **CORS**: Configured for frontend origin, credentials enabled
- **Headers**: Secure HTTP headers set in `main.ts`
- **CASL**: Only owner can CRUD their todos (unless admin)

---

## 🧪 Testing
- **Unit tests**: `npm run test`
- **E2E tests**: `npm run test:e2e`
- **Lint**: `npm run lint`
- **Format**: `npm run format`

---

## 🧑‍💻 Development
- **Prisma schema**: Edit `prisma/schema.prisma`, then run `npx prisma generate`
- **Migrations**: `npx prisma migrate dev --name <desc>`
- **Hot reload**: `npm run start:dev`
- **API docs**: (Optional) Add Swagger module for `/api` docs

---

## 📝 Example .env
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
```

---

## 🛡️ Security Best Practices
- Use strong JWT_SECRET in production
- Use HTTPS in production (set `secure: true` for cookies)
- Regularly update dependencies
- Restrict CORS to trusted origins
- Use environment variables for secrets

---

## 📦 Project Structure
```
├── prisma/
│   └── schema.prisma
├── src/
│   ├── auth/
│   ├── todo/
│   ├── main.ts
│   └── app.module.ts
├── test/
├── package.json
├── tsconfig.json
└── ...
```

---

## 🤝 Contributing
PRs and issues are welcome! Please follow code style and add tests for new features.

---

## 📄 License
MIT
