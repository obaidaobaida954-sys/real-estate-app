# 🏗️ معمارية التطبيق

## هيكل البيانات

```
┌─────────────────────────────────────────────────────────────┐
│                      Supabase (Backend)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌────────────────┐  ┌───────────────┐   │
│  │ properties   │  │ notifications  │  │ contact_info  │   │
│  │ (العقارات)   │  │ (الإشعارات)    │  │(معلومات التواصل)│   │
│  └──────────────┘  └────────────────┘  └───────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────────────┐
│                 supabase.ts (Supabase Client)                │
│              مع Types: Property, Notification, etc           │
└─────────────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────────────┐
│                    AppContext.tsx                            │
│  State: properties[], notifications[], contactInfo,loading   │
│  Functions: refreshProperties(), refreshNotifications()...   │
└─────────────────────────────────────────────────────────────┘
                           ↕️
┌─────────────────────────────────────────────────────────────┐
│                   React Components                           │
│   Home.tsx  │ Contact.tsx │ Admin.tsx │ PropertyCard.tsx    │
└─────────────────────────────────────────────────────────────┘
```

## دورة حياة البيانات

### 1️⃣ عند فتح التطبيق

```typescript
// في AppContext.tsx - useEffect يعمل مرة واحدة عند التحميل
useEffect(() => {
  const init = async () => {
    setLoading(true);
    await Promise.all([
      refreshProperties(),      // جلب كل العقارات
      refreshNotifications(),   // جلب آخر 10 إشعارات
      refreshContactInfo(),     // جلب معلومات التواصل
    ]);
    setLoading(false);
  };
  init();
}, []);
```

### 2️⃣ عرض البيانات

```typescript
// في Home.tsx
const { properties, loading, lang } = useAppContext();

// إذا كان loading = true → يظهر spinner
// إذا كان loading = false → يعرض العقارات
```

### 3️⃣ تحديث البيانات (من Admin)

```typescript
// في Admin.tsx
const addProperty = async () => {
  // 1. إضافة في Supabase
  await supabase.from("properties").insert([newProperty]);
  
  // 2. تحديث الـ State
  await refreshProperties();
  
  // 3. المكونات الأخرى ترى البيانات الجديدة تلقائياً
};
```

### 4️⃣ التخزين المحلي (localStorage)

```typescript
// المفضلة تُحفظ محلياً
localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));

// الإشعارات المقروءة تُحفظ محلياً
localStorage.setItem('readNotifications', JSON.stringify(Array.from(read)));
```

---

## تدفق التطبيق

### 🏠 صفحة Home

```
Home.tsx
  ├─ جلب properties من useAppContext()
  ├─ تطبيق Search/Filter/Sort
  ├─ عرض PropertyCard لكل عقار
  └─ عند الضغط على عقار → PropertyModal
```

### 👤 صفحة Contact

```
Contact.tsx
  ├─ جلب contactInfo من useAppContext()
  ├─ إنشء روابط حسب البيانات:
  │   ├─ WhatsApp: https://wa.me/NUMBER
  │   ├─ Phone: tel:NUMBER
  │   └─ Email: mailto:EMAIL
  └─ كل رابط قابل للنقر
```

### 🔐 صفحة Admin

```
Admin.tsx
  ├─ شاشة تسجيل دخول (كلمة المرور من .env)
  │
  ├─ Tab: العقارات
  │   ├─ Form لإضافة عقار جديد
  │   └─ قائمة العقارات مع تحرير/حذف
  │
  ├─ Tab: الإشعارات
  │   ├─ Form لكتابة إشعار جديد
  │   └─ يُحفظ في Supabase
  │
  └─ Tab: معلومات التواصل
      ├─ Form لتعديل أرقام الهاتف والبريد
      └─ يُحدّث في Supabase
```

### 🔔 جرس الإشعارات

```
NotificationBell.tsx
  ├─ جلب notifications من useAppContext()
  ├─ عد الإشعارات غير المقروءة
  ├─ عند الضغط → يفتح Panel بالإشعارات
  └─ الإشعارات المقروءة تُحفظ في localStorage
```

---

## تفاعل المستخدم

### الخطوة 1: المستخدم يفتح التطبيق
```
التطبيق ينطلق
  ↓
AppContext يحمّل البيانات من Supabase
  ↓
Home.tsx يعرض loading spinner
  ↓
البيانات تُحمّل
  ↓
Spinner يختفي
  ↓
العقارات تظهر
```

### الخطوة 2: المستخدم يبحث عن عقار
```
يكتب في Search box
  ↓
filteredProperties تُحدّث
  ↓
العقارات تُصفّى بناءً على البحث
  ↓
Property Cards تُرسم جديدة بـ animation
```

### الخطوة 3: المستخدم يضيف إلى المفضلة
```
يضغط على قلب الحب في PropertyCard
  ↓
toggleFavorite() تُستدعى
  ↓
favorites Set تتحدّث
  ↓
localStorage تتحدّث
  ↓
توست النجاح يظهر
  ↓
عند الفتح المقبل → المفضلة تبقى
```

### الخطوة 4: المسؤول يضيف عقار جديد
```
يدخل صفحة Admin
  ↓
يملأ فورم الإضافة
  ↓
يضغط "إضافة العقار"
  ↓
البيانات تُرسل إلى Supabase
  ↓
refreshProperties() تُستدعى
  ↓
properties State تتحدّث
  ↓
جميع المكونات التي تعتمد على properties تُعيد الرسم
  ↓
Home.tsx يظهر العقار الجديد
  ↓
المستخدمون يرونه عند الفتح المقبل
```

---

## المتغيرات البيئية

### في التطوير (.env.local)
```
VITE_SUPABASE_URL=...        # يُستخدم عند البناء
VITE_SUPABASE_ANON_KEY=...  # للقراءة/الكتابة العامة
VITE_ADMIN_PASSWORD=...      # تسجيل دخول Admin
```

### في الإنتاج
- استخدم نفس المتغيرات في Vercel/Netlify settings
- لا تضع المتغيرات مباشرة في الكود

---

## الأمان (Security)

### Row Level Security (RLS)
```sql
-- الجميع يستطيعون قراءة البيانات
CREATE POLICY "Allow public read" ON properties
  FOR SELECT USING (true);

-- الجميع يستطيعون إضافة (يمكن تقييده بـ auth مستقبلاً)
CREATE POLICY "Allow insert" ON properties
  FOR INSERT WITH CHECK (true);
```

### كلمة المرور
```
Admin password تُحفظ في متغيرات البيئة فقط
لا تكتبها في الكود أبداً
```

### localStorage
```
المفضلة والإشعارات المقروءة آمنة (client-side فقط)
البيانات الحساسة (أرقام الهاتف) في Supabase
```

---

## الأداء (Performance)

### Indexes
```sql
CREATE INDEX ON properties(type);
CREATE INDEX ON properties(category);
CREATE INDEX ON properties(created_at DESC);
```

### Caching
```typescript
// البيانات في State - لا تُطلب مرتين
// localStorage للمفضلة - لا تُطلب من Supabase
```

### Animations
```typescript
// استخدام motion.react للـ animations الخفيفة
// لا تؤثر على الأداء
```

---

## التطور المستقبلي

### 1. Authentication
```typescript
// استخدام Supabase Auth
const { user } = useAuth();
if (user.role === 'admin') { ... }
```

### 2. Real-time Subscriptions
```typescript
// استخدام Supabase Realtime
supabase
  .from('properties')
  .on('*', payload => {
    setProperties([...]);
  })
  .subscribe();
```

### 3. Image Upload
```typescript
// استخدام Supabase Storage
const { data } = await supabase.storage
  .from('properties')
  .upload('path', file);
```

### 4. Push Notifications
```typescript
// استخدام Firebase Cloud Messaging
// أو Supabase + Expo
```

---

## استكشاف الأخطاء

### خطأ: "Cannot read property 'properties' of undefined"
→ تأكد من استخدام `useAppContext()` داخل `<AppProvider>`

### خطأ: "Supabase connection failed"
→ تحقق من `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY`

### خطأ: "Table does not exist"
→ قم بتشغيل SQL Migration من جديد

---

**✅ معمارية واضحة وموثقة!**
