# دليل إطلاق عقاري (Aqari)

## 1. متغيرات البيئة (مطلوبة)

انسخ `.env.example` إلى `.env` محلياً، وعلى **Vercel → Settings → Environment Variables** أضف:

| المتغير | الوصف | أين تحصل عليه |
|---------|--------|----------------|
| `VITE_SUPABASE_URL` | رابط مشروع Supabase | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | المفتاح العام (anon) | نفس الصفحة → anon public key |
| `VITE_ADMIN_EMAIL` | بريد الأدمن الوحيد المسموح | البريد الذي أنشأت به حساب Supabase Auth |
| `VITE_GOOGLE_MAPS_API_KEY` | خرائط Google (اختياري للخريطة) | Google Cloud Console → Maps JavaScript API |
| `VITE_DEBUG_LOGS` | `false` في الإنتاج | — |

> **مهم:** لا تضع `service_role` key في Vite — يظهر في المتصفح ويعرّض قاعدة البيانات.

---

## 2. Supabase (قاعدة البيانات + Auth)

1. أنشئ مشروعاً على [supabase.com](https://supabase.com).
2. من **SQL Editor** نفّذ ملفات `supabase/migrations/` بالترتيب (أو `npm run migrate:apply` إن كان Supabase CLI مضبوطاً).
3. من **Authentication → Users** أنشئ مستخدم الأدمن بنفس بريد `VITE_ADMIN_EMAIL`.
4. تأكد أن سياسات RLS في migrations تسمح للأدمن بالكتابة على `properties` و `notifications`.
5. املأ جدول `contact_info` بسطر واحد (واتساب، هاتف، بريد).

---

## 3. النشر على Vercel

1. اربط المستودع GitHub بمشروع Vercel.
2. **Framework:** Vite — **Build:** `npm run build` — **Output:** `dist`
3. أضف كل متغيرات البيئة أعلاه لـ Production و Preview.
4. بعد النشر: افتح `https://your-domain.vercel.app` وتحقق من `/admin`.

---

## 4. SEO (تم إعداده في المشروع)

- `public/robots.txt`
- `public/sitemap.xml`
- `index.html`: meta keywords, canonical, robots

بعد النشر: أرسل Sitemap في [Google Search Console](https://search.google.com/search-console):
`https://aqari.vercel.app/sitemap.xml`

---

## 5. اختبار قبل الإطلاق (يدوي)

| الاختبار | المسار |
|----------|--------|
| تحميل العقارات | `/home` |
| بحث + فلاتر + مسح | `/home` |
| مفضلة بدون/مع تسجيل | `/saved` |
| إشعارات + وقت نسبي | جرس الإشعارات |
| لوحة أدمن | `/admin` |
| PWA على iPhone | Safari → مشاركة → إضافة للشاشة الرئيسية |
| الوضع الداكن + RTL | الإعدادات |

---

## 6. أوامر محلية

```bash
npm install
cp .env.example .env   # ثم عدّل القيم
npm run dev            # http://localhost:5173
npm run build          # تحقق قبل النشر
```

---

## 7. ما تحتاجه أنت فقط (لا يُنفَّذ من الكود)

- [ ] حساب Supabase + migrations
- [ ] حساب Vercel + متغيرات البيئة
- [ ] مفتاح Google Maps (إن أردت الخرائط)
- [ ] iPhone حقيقي لاختبار PWA والـ safe-area
- [ ] Google Search Console (اختياري)

**بعد إكمال القائمة أعلاه → التطبيق جاهز للإطلاق العام.**
