# Security Upgrades Guide

## 🔒 **Các cải tiến bảo mật đã thêm:**

### **1. Cookie-based Authentication**
- ✅ **HttpOnly cookies** - Ngăn XSS attacks
- ✅ **Secure flag** - Chỉ gửi qua HTTPS
- ✅ **SameSite=strict** - Ngăn CSRF attacks
- ✅ **Automatic token refresh**

### **2. CASL Authorization**
- ✅ **Role-based access control**
- ✅ **Resource-level permissions**
- ✅ **Declarative permissions** với decorators
- ✅ **Flexible permission system**

### **3. Security Headers**
- ✅ **X-Content-Type-Options: nosniff**
- ✅ **X-Frame-Options: DENY**
- ✅ **X-XSS-Protection: 1; mode=block**
- ✅ **Strict-Transport-Security**

### **4. CORS Configuration**
- ✅ **Origin validation**
- ✅ **Credentials support**
- ✅ **Secure cross-origin requests**

## 🚀 **Cách sử dụng:**

### **Authentication với Cookie:**
```bash
# Register (tự động set cookie)
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "John", "password": "password123"}' \
  -c cookies.txt

# Login (tự động set cookie)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}' \
  -c cookies.txt

# Sử dụng cookie cho requests
curl -X GET http://localhost:3000/todos \
  -b cookies.txt
```

### **Authorization với CASL:**
```typescript
// Tự động kiểm tra permissions
@Casl({ action: Action.Create, subject: 'Todo' })
async create(@Body() body: CreateTodoDto) {
  // Chỉ user có quyền CREATE mới vào được
}
```

## 🔧 **Cấu hình Environment:**

```env
# JWT Configuration
JWT_SECRET="your-super-secret-key-here"
JWT_EXPIRES_IN="24h"

# Security
NODE_ENV="production"
FRONTEND_URL="https://your-frontend.com"

# Database
DATABASE_URL="your-database-url"
```

## 📊 **So sánh trước và sau:**

### **Trước (Chỉ JWT):**
- ❌ Token lưu trong localStorage (dễ bị XSS)
- ❌ Không có role-based permissions
- ❌ Thiếu security headers
- ❌ Không có CSRF protection

### **Sau (JWT + Cookie + CASL):**
- ✅ Token lưu trong HttpOnly cookie
- ✅ Role-based authorization với CASL
- ✅ Security headers đầy đủ
- ✅ CSRF protection với SameSite
- ✅ Automatic token refresh

## 🛡️ **Security Features:**

### **1. Cookie Security:**
```typescript
// Secure cookie configuration
{
  httpOnly: true,        // Ngăn JavaScript access
  secure: true,          // Chỉ HTTPS
  sameSite: 'strict',    // CSRF protection
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
}
```

### **2. CASL Permissions:**
```typescript
// Admin có thể làm mọi thứ
if (user.role === 'admin') {
  can(Action.Manage, 'all');
}

// User thường chỉ quản lý todos của mình
can(Action.Read, 'Todo', { userId: user.userId });
```

### **3. Security Headers:**
```typescript
// Ngăn MIME type sniffing
res.setHeader('X-Content-Type-Options', 'nosniff');

// Ngăn clickjacking
res.setHeader('X-Frame-Options', 'DENY');

// XSS protection
res.setHeader('X-XSS-Protection', '1; mode=block');

// Force HTTPS
res.setHeader('Strict-Transport-Security', 'max-age=31536000');
```

## 🎯 **Benefits:**

1. **Enhanced Security**: Cookie-based auth an toàn hơn localStorage
2. **Role-based Access**: CASL cung cấp flexible permissions
3. **CSRF Protection**: SameSite cookies ngăn CSRF attacks
4. **XSS Protection**: HttpOnly cookies ngăn XSS
5. **Automatic Refresh**: Token tự động refresh
6. **Security Headers**: Bảo vệ khỏi các attacks phổ biến

## 🔄 **Migration Path:**

1. **Phase 1**: Thêm cookie support (đã hoàn thành)
2. **Phase 2**: Implement CASL authorization (đã hoàn thành)
3. **Phase 3**: Add rate limiting
4. **Phase 4**: Add audit logging
5. **Phase 5**: Add session management

## 📈 **Performance Impact:**

- ✅ **Minimal overhead**: Cookie parsing nhanh
- ✅ **Efficient CASL**: Permission checking tối ưu
- ✅ **Cached abilities**: CASL cache permissions
- ✅ **Lightweight**: Không ảnh hưởng performance

## 🚨 **Best Practices:**

1. **Rotate JWT secrets** định kỳ
2. **Monitor failed auth attempts**
3. **Log security events**
4. **Use HTTPS in production**
5. **Implement rate limiting**
6. **Regular security audits** 