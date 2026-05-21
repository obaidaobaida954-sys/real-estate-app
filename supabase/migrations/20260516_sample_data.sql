-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================
-- Run this AFTER you've run the main migration
-- This adds test data to help with development

-- Insert sample properties
INSERT INTO properties (title_ar, title_en, type, category, price, rooms, bathrooms, area, phone, location_ar, location_en, agent_name_ar, agent_name_en, image_url)
VALUES
(
  'فيلا فاخرة بحي النخيل',
  'Luxurious Villa in Al Nakheel',
  'sale',
  'house',
  850000,
  5,
  3,
  450,
  '0501234567',
  'حي النخيل، السويداء',
  'Al Nakheel, Suwaida',
  'مكتب الريان العقاري',
  'Al Rayan Real Estate',
  'https://images.unsplash.com/photo-1706855203772-c249b75fe016?auto=format&fit=crop&q=80&w=800'
),
(
  'شقة راقية في المركز',
  'Upscale Apartment Downtown',
  'rent',
  'apartment',
  3500,
  3,
  2,
  180,
  '0507654321',
  'برج السويداء، وسط المدينة',
  'Suwaida Tower, City Center',
  'مكتب الأمانة العقاري',
  'Al Amana Real Estate',
  'https://images.unsplash.com/photo-1737898378296-94dc316cd443?auto=format&fit=crop&q=80&w=800'
),
(
  'محل تجاري متميز',
  'Premium Commercial Space',
  'sale',
  'commercial',
  1200000,
  8,
  4,
  320,
  '0509876543',
  'وسط المدينة، السويداء',
  'City Center, Suwaida',
  'مكتب النخبة العقاري',
  'Al Nukhba Real Estate',
  'https://images.unsplash.com/photo-1656646425215-a3f999cf9c17?auto=format&fit=crop&q=80&w=800'
),
(
  'أرض واسعة للاستثمار',
  'Large Plot for Investment',
  'sale',
  'land',
  2500000,
  0,
  0,
  800,
  '0501112233',
  'حي الورود، السويداء',
  'Al Wurood, Suwaida',
  'مكتب الدار العقاري',
  'Al Dar Real Estate',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'
),
(
  'شقة دافئة وهادئة',
  'Cozy and Quiet Apartment',
  'rent',
  'apartment',
  2800,
  2,
  1,
  120,
  '0504455667',
  'حي السلام، السويداء',
  'Al Salam, Suwaida',
  'مكتب الماسة العقاري',
  'Al Masa Real Estate',
  'https://images.unsplash.com/photo-1617721595342-ab308966360c?auto=format&fit=crop&q=80&w=800'
);

-- Insert sample notifications
INSERT INTO notifications (title, message)
VALUES
(
  'مرحباً بك في تطبيق عقاري',
  'شكراً لاستخدام تطبيقنا. يمكنك الآن البحث عن العقارات المثالية'
),
(
  'عقارات جديدة متاحة',
  'تم إضافة 5 عقارات جديدة هذا الأسبوع. تفضل بالمراجعة'
),
(
  'تحديث التطبيق',
  'تم تحسين سرعة البحث والتصفية. استمتع بتجربة أفضل'
);

-- contact_info should already have one default row from the migration
-- But you can update it if needed
UPDATE contact_info
SET 
  whatsapp = '+96398765432',
  phone = '+96398765432',
  email = 'info@aqari.sy'
WHERE id = (SELECT id FROM contact_info LIMIT 1);
