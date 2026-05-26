# مشروع عقاري - Aqari App (عقاري)

## نظرة عامة
تطبيق عقارات للسويداء، سوريا. مبني لعرض وبيع وإيجار العقارات.
Mobile-first تطبيق (max-w-md) يدعم العربية والإنجليزية مع RTL.

## التقنيات المستخدمة
- React 18 + TypeScript + Vite
- TailwindCSS v4 + shadcn/ui
- Supabase (database + auth)
- Framer Motion (animations)
- React Router v7
- Sonner (toast notifications)

## هيكل المشروع
```
src/
├── app/
│   ├── components/     ← المكونات المشتركة
│   ├── context/        ← AppContext (قلب التطبيق)
│   ├── pages/          ← الصفحات
│   └── i18n.ts         ← الترجمة العربية/الإنجليزية
├── lib/
│   └── supabase.ts     ← Supabase client + types
└── styles/             ← التصميم العام
```

## قاعدة البيانات (Supabase)
- **properties** — جدول العقارات الرئيسي
- **notifications** — إشعارات للمستخدمين
- **contact_info** — معلومات التواصل (سطر واحد دائماً)

## قواعد الكود الإلزامية
1. TypeScript دائماً — لا `any` إلا عند الضرورة القصوى
2. كل المكونات في `src/app/components/`
3. كل الصفحات في `src/app/pages/`
4. كل الأنواع في `src/lib/supabase.ts`
5. لا `console.log` في الكود النهائي
6. `React.memo` للمكونات التي تتكرر في القوائم
7. كل مكون يجب أن يدعم dark/light mode
8. كل مكون يجب أن يدعم RTL (العربية) و LTR (الإنجليزية)

## تعليمات للـ AI
- اشرح كل تعديل تعمله بالعربية
- اقترح تحسينات بعد كل مهمة
- تحقق من TypeScript errors قبل الانتهاء
- لا تكسر الـ dark mode أو RTL أبداً
- استخدم الأنواع الموجودة في supabase.ts
- بعد كل تعديل اقترح الخطوة التالية

## متغيرات البيئة المطلوبة
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ADMIN_PASSWORD=
```
