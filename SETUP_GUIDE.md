# 🏠 تطبيق العقارات - دليل الإعداد

## الحالة الحالية ✅

تم إنجاز جميع المتطلبات بنجاح! التطبيق الآن متصل بالكامل مع Supabase.

### ✅ المكونات المكتملة:

1. **supabase.ts** - العميل والـ Types
   - `supabase` client مع متغيرات البيئة
   - Types: `Property`, `Notification`, `ContactInfo`

2. **AppContext.tsx** - Context الرئيسي
   - State للبيانات من Supabase
   - دوال refresh للبيانات الثلاثة
   - تحميل البيانات عند بداية التطبيق
   - حفظ المفضلة في localStorage

3. **Admin.tsx** - لوحة التحكم
   - ✅ حذف كلمة المرور الثابتة "admin2024"
   - ✅ 3 تبويبات: العقارات، الإشعارات، معلومات التواصل
   - ✅ إضافة/تعديل/حذف العقارات
   - ✅ إرسال الإشعارات إلى Supabase
   - ✅ تحديث معلومات التواصل

4. **Home.tsx** - الصفحة الرئيسية
   - ✅ loading state مع spinner
   - ✅ البيانات من AppContext
   - ✅ البحث والفلاتر يعملان بصحة

5. **PropertyCard.tsx** - بطاقة العقار
   - ✅ عرض title_ar و title_en حسب اللغة
   - ✅ البيانات من AppContext

6. **NotificationBell.tsx** - جرس الإشعارات
   - ✅ الإشعارات من AppContext (Supabase)

7. **Contact.tsx** - صفحة التواصل
   - ✅ البيانات من AppContext (Supabase)

8. **SQL Migration** - جاهز للتشغيل
   - ✅ جدول properties مع كل الحقول
   - ✅ جدول notifications
   - ✅ جدول contact_info مع insert افتراضي
   - ✅ Row Level Security
   - ✅ Indexes للأداء

---

## 📋 خطوات الإعداد

### 1️⃣ إنشاء مشروع Supabase

1. توجه إلى [supabase.com](https://supabase.com)
2. اضغط "Create a new project"
3. اختر اسم المشروع (مثل: real-estate-app)
4. اختر password قوية
5. اختر المنطقة (Europe أو Asia)
6. اضغط "Create new project"

### 2️⃣ الحصول على مفاتيح الوصول

1. انتظر إنشاء المشروع (2-3 دقائق)
2. اذهب إلى Settings → API
3. انسخ هذه القيم:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

### 3️⃣ إنشاء ملف البيئة المحلي

أنشئ ملف `.env.local` في جذر المشروع:

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ADMIN_PASSWORD=your-secure-password-here
```

⚠️ **مهم جداً:** لا تقم بـ commit هذا الملف! (محمي بـ .gitignore)

### 4️⃣ تشغيل SQL Migration

1. افتح Supabase Dashboard
2. اذهب إلى SQL Editor
3. اضغط "New Query"
4. انسخ محتوى الملف: `supabase/migrations/20260516_create_tables.sql`
5. الصق في محرر SQL
6. اضغط "Run"

✅ الآن تم إنشاء الجداول والـ Policies

### 5️⃣ اختبار الاتصال

```bash
npm run dev
```

1. افتح صفحة Contact - يجب أن ترى بيانات الاتصال الافتراضية
2. افتح صفحة Home - يجب أن ترى loading spinner قصيراً ثم قائمة فارغة
3. افتح Admin (الرابط من الـ sidebar) وادخل كلمة المرور
4. جرب إضافة عقار جديد

---

## 🗄️ هيكل قاعدة البيانات

### جدول `properties`
```
- id (UUID)
- title_ar / title_en (Text)
- type (sale | rent)
- category (house | apartment | commercial | land)
- price (Decimal)
- rooms / bathrooms (Integer)
- area (Decimal - m²)
- phone (Text)
- location_ar / location_en (Text)
- agent_name_ar / agent_name_en (Text)
- image_url (Text)
- created_at / updated_at (Timestamp)
```

### جدول `notifications`
```
- id (UUID)
- title (Text)
- message (Text)
- created_at (Timestamp)
```

### جدول `contact_info`
```
- id (UUID)
- whatsapp (Text)
- phone (Text)
- email (Text)
- created_at / updated_at (Timestamp)
```

---

## 🔐 Row Level Security

جميع الجداول لها RLS مفعل:

- **SELECT:** مفتوح للجميع (public read)
- **INSERT/UPDATE:** متاح للقراء (يمكن تقييده بـ authentication مستقبلاً)
- **DELETE:** متاح للقراء (يمكن تقييده بـ authentication مستقبلاً)

⚠️ للإنتاج: استخدم Service Role Key للعمليات الحساسة

---

## 🚀 ميزات التطبيق

### المستخدم النهائي:
- 🔍 البحث عن العقارات
- 🏷️ فلترة حسب النوع والفئة
- ⭐ حفظ المفضلات
- 🔔 الإشعارات
- 📱 معلومات التواصل

### المسؤول:
- ➕ إضافة عقارات جديدة
- ✏️ تعديل العقارات
- 🗑️ حذف العقارات
- 📢 إرسال الإشعارات
- 📞 تحديث معلومات التواصل

---

## 🌐 دعم اللغات

التطبيق يدعم:
- **العربية** (RTL) - لغة افتراضية
- **الإنجليزية** (LTR)

يتم التبديل من الـ Settings

---

## 📱 المتغيرات البيئية المطلوبة

| المتغير | المصدر | الملاحظة |
|--------|--------|---------|
| `VITE_SUPABASE_URL` | Supabase Settings | رابط المشروع |
| `VITE_SUPABASE_ANON_KEY` | Supabase Settings | Public Key |
| `VITE_ADMIN_PASSWORD` | اختيارك | كلمة مرور لوحة التحكم |

---

## 🔄 دورة حياة البيانات

```
1. التطبيق ينطلق
   ↓
2. AppContext يستدعي refreshProperties(), refreshNotifications(), refreshContactInfo()
   ↓
3. Supabase يعيد البيانات
   ↓
4. البيانات تُحفظ في State
   ↓
5. المكونات تعرض البيانات
   ↓
6. (عند تحديث) المسؤول يرسل تحديث
   ↓
7. البيانات تُحفظ في Supabase
   ↓
8. يتم استدعاء refresh function
   ↓
9. البيانات تتحدث في التطبيق
```

---

## 🛠️ استكشاف الأخطاء

### المشكلة: "خطأ في الاتصال بـ Supabase"
- ✅ تحقق من `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY`
- ✅ تأكد من تشغيل SQL Migration
- ✅ افتح Supabase Dashboard وتحقق من الجداول

### المشكلة: صفحة Home فارغة
- ✅ تحقق من أن جدول `properties` موجود
- ✅ أضف عقار جديد من Admin
- ✅ تحقق من الكونسول (F12) من الأخطاء

### المشكلة: Contact page تظهر قيم فارغة
- ✅ تأكد من تشغيل insert الافتراضي في SQL
- ✅ افتح Supabase Dashboard وتحقق من جدول `contact_info`

---

## 📚 الملفات المهمة

```
src/
├── lib/supabase.ts              ← Supabase client
├── app/
│   ├── context/AppContext.tsx   ← State و Data Fetching
│   ├── pages/
│   │   ├── Home.tsx             ← الصفحة الرئيسية
│   │   ├── Contact.tsx          ← صفحة التواصل
│   │   └── Admin.tsx            ← لوحة التحكم
│   └── components/
│       ├── PropertyCard.tsx      ← بطاقة العقار
│       └── NotificationBell.tsx  ← جرس الإشعارات
├── .env.local                   ← متغيرات البيئة (لا تقم بـ commit)
└── .env.example                 ← قالب المتغيرات

supabase/
└── migrations/
    └── 20260516_create_tables.sql  ← SQL Migration
```

---

## 🎯 الخطوات التالية (اختيارية)

1. **Authentication:** أضف تسجيل دخول حقيقي مع Supabase Auth
2. **Admin Panel:** قيّد الوصول لـ Admin فقط
3. **Image Upload:** استخدم Supabase Storage للصور
4. **Notifications:** أضف Real-time Subscriptions
5. **Analytics:** تتبع النشاط والبحث

---

## 📞 الدعم

للمساعدة:
1. تحقق من Supabase Documentation: https://supabase.com/docs
2. افتح browser console (F12) لرؤية الأخطاء
3. تحقق من Network tab لأخطاء الـ API

---

**تم الإعداد بنجاح! ✨**
