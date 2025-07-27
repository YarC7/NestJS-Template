# ESLint Guide cho NestJS

## Các lỗi ESLint thường gặp và cách sửa

### 1. **Async/Await Issues**

```typescript
// ❌ Lỗi: Async method không có await
async findAll(): Promise<Todo[]> {
  return this.todoService.findAll(); // Thiếu await
}

// ✅ Đúng: Thêm await
async findAll(): Promise<Todo[]> {
  return await this.todoService.findAll();
}
```

### 2. **Readonly Constructor Parameters**

```typescript
// ❌ Cảnh báo: Parameter không được đánh dấu readonly
constructor(private prisma: PrismaService) {}

// ✅ Đúng: Thêm readonly
constructor(private readonly prisma: PrismaService) {}
```

### 3. **Type Safety Issues**

```typescript
// ❌ Lỗi: Unsafe return type
return this.prisma.todo.findMany(); // TypeScript báo 'any'

// ✅ Đúng: Thêm await để có type safety
return await this.prisma.todo.findMany();
```

## Cấu hình ESLint đã được tối ưu

### Rules đã tắt (quá strict):

- `@typescript-eslint/no-floating-promises`: Tắt cảnh báo về Promise không await
- `@typescript-eslint/no-unsafe-*`: Tắt các rule về type safety quá strict
- `@typescript-eslint/explicit-*`: Tắt yêu cầu khai báo type rõ ràng

### Rules vẫn giữ lại:

- `@typescript-eslint/prefer-readonly`: Cảnh báo về readonly parameters
- `@typescript-eslint/await-thenable`: Cảnh báo khi await không cần thiết
- `@typescript-eslint/require-await`: Cảnh báo khi async không có await

## Commands hữu ích

```bash
# Chạy ESLint và tự động sửa
npm run lint

# Chỉ kiểm tra lỗi (không sửa)
npm run lint:check

# Format code với Prettier
npm run format

# Chạy cả lint và format
npm run lint-format
```

## Tips để tránh lỗi ESLint

1. **Luôn dùng await với async functions**
2. **Đánh dấu readonly cho constructor parameters**
3. **Sử dụng nullish coalescing (??) thay vì logical OR (||)**
4. **Import đầy đủ các types cần thiết**

## Tùy chỉnh thêm (nếu cần)

Nếu vẫn gặp lỗi phiền phức, có thể thêm vào `eslint.config.mjs`:

```javascript
rules: {
  // Tắt thêm rules nếu cần
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/no-empty-interface': 'off',
}
```
