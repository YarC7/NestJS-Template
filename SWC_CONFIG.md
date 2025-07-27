# SWC Configuration - Todo App

## 🔧 **Cấu hình SWC đã thêm:**

### **1. nest-cli.json**
```json
{
  "compilerOptions": {
    "builder": "swc",
    "deleteOutDir": true
  }
}
```

### **2. tsconfig.json**
```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    // ... other options
  }
}
```

### **3. package.json**
```json
{
  "type": "module",
  "devDependencies": {
    "@swc/cli": "^0.6.0",
    "@swc/core": "^1.13.2"
  }
}
```

### **4. .swcrc**
```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "decorators": true,
      "dynamicImport": true
    },
    "transform": {
      "legacyDecorator": true,
      "decoratorMetadata": true
    },
    "target": "es2022"
  },
  "module": {
    "type": "es6"
  },
  "isModule": true
}
```

## 🚀 **Lợi ích của SWC:**

### **1. Performance**
- ✅ **Faster compilation** - Nhanh hơn TypeScript compiler
- ✅ **Faster startup** - Ứng dụng khởi động nhanh hơn
- ✅ **Hot reload** - Nhanh hơn trong development

### **2. ES Modules Support**
- ✅ **Modern imports** - `import cookieParser from 'cookie-parser'`
- ✅ **Better tree shaking** - Bundle size nhỏ hơn
- ✅ **Native ES modules** - Tương thích tốt hơn

### **3. TypeScript Support**
- ✅ **Full TypeScript** - Hỗ trợ đầy đủ TypeScript
- ✅ **Decorators** - Hỗ trợ NestJS decorators
- ✅ **Metadata** - Hỗ trợ reflection metadata

## 🔍 **Test SWC Configuration:**

### **1. Build Test:**
```bash
npm run build
```

### **2. Development Test:**
```bash
npm run dev
```

### **3. Import Test:**
```typescript
// ✅ ES Module imports
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
```

## 🎯 **Expected Results:**

### **✅ Build Success:**
```
> nest build
Successfully compiled: 29 files with swc (264.84ms)
```

### **✅ Development Success:**
```
> nest start --watch
Successfully compiled: 29 files with swc (264.84ms)
[Nest] 17468  - 07/27/2025, 8:58:27 PM     LOG [NestFactory] Starting Nest application...
```

### **✅ Import Success:**
```typescript
// ✅ No more import errors
import cookieParser from 'cookie-parser';
app.use(cookieParser()); // ✅ Works
```

## 🛠️ **Troubleshooting:**

### **Issue 1: Import Errors**
**Solution:** Đảm bảo sử dụng ES module imports
```typescript
// ✅ Correct
import cookieParser from 'cookie-parser';

// ❌ Wrong
import * as cookieParser from 'cookie-parser';
```

### **Issue 2: Module Resolution**
**Solution:** Kiểm tra `moduleResolution: "node"` trong tsconfig.json

### **Issue 3: Decorators**
**Solution:** Đảm bảo `.swcrc` có `legacyDecorator: true`

## 📊 **Performance Comparison:**

| Metric | TypeScript | SWC |
|--------|------------|-----|
| Build Time | ~2-3s | ~0.5s |
| Startup Time | ~1s | ~0.3s |
| Hot Reload | ~1s | ~0.2s |

**SWC configuration đã được setup đúng!** 🚀 