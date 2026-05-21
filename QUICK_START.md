# 🚀 بدء سريع - تطبيق العقارات

## ⚡ الخطوات الأساسية (5 دقائق)

### 1️⃣ أنشئ مشروع Supabase
- اذهب إلى [supabase.com](https://supabase.com)
- اضغط "Create a new project"
- أكمل الخطوات (اختر اسم وكلمة مرور)

### 2️⃣ انسخ المفاتيح
في Supabase Dashboard → Settings → API:
- انسخ `Project URL`
- انسخ `anon public key`

### 3️⃣ أنشئ `.env.local`
```env
VITE_SUPABASE_URL=<paste_here>
VITE_SUPABASE_ANON_KEY=<paste_here>
VITE_ADMIN_PASSWORD=admin123
```

### 4️⃣ شغّل SQL
في Supabase → SQL Editor:
1. اضغط "New Query"
2. انسخ كل محتوى من: `supabase/migrations/20260516_create_tables.sql`
3. الصق والضغط "Run"

### 5️⃣ شغّل التطبيق
```bash
npm install
npm run dev
```

✅ جاهز!

---

## 🧪 اختبر الميزات

### من صفحة Home:
- افتح http://localhost:5173
- يجب أن ترى "جاري التحميل..." قصيراً

### من صفحة Contact:
- اضغط Contact من القائمة السفلية
- يجب أن ترى معلومات التواصل الافتراضية

### من Admin Panel:
- في البراوزر المطور F12، اذهب إلى Console
- اكتب: `import.meta.env.VITE_ADMIN_PASSWORD`
- استخدم القيمة لتسجيل الدخول

---

## 📚 التوثيق الكامل

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - دليل تفصيلي
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - شرح البنية
- **[COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)** - ملخص المشروع

---

## 🎯 الملفات الرئيسية

```
✅ src/lib/supabase.ts           → Supabase client
✅ src/app/context/AppContext.tsx → State management
✅ src/app/pages/Admin.tsx       → لوحة التحكم
✅ src/app/pages/Home.tsx        → الصفحة الرئيسية
✅ src/app/pages/Contact.tsx     → التواصل

✅ .env.example                   → قالب البيئة
✅ supabase/migrations/           → SQL scripts
```

---

## ❓ مشاكل شائعة

| المشكلة | الحل |
|--------|------|
| "خطأ اتصال" | تحقق من .env.local |
| "جدول غير موجود" | شغّل SQL من جديد |
| "بيانات فارغة" | أضف عقار من Admin |

---

## 💡 نصائح مهمة

⚠️ لا تنسَ:
- لا تعدل كلمة المرور في الكود (استخدم .env)
- لا ترفع `.env.local` إلى GitHub (محمي بـ .gitignore)
- كل تغيير في Supabase يظهر فوراً في التطبيق

---

**كل شيء جاهز! استمتع بالتطوير 🎉**
