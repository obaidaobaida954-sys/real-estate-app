-- ============================================
-- COMPLETE SQL SETUP FOR REAL ESTATE APP
-- ============================================
-- Copy all content below and paste into Supabase SQL Editor
-- Run in this order:
-- 1. Tables creation (below)
-- 2. Then run: supabase/migrations/20260516_sample_data.sql

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
  category TEXT NOT NULL CHECK (category IN ('house', 'apartment', 'commercial', 'land')),
  price DECIMAL(15, 2) NOT NULL,
  rooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  area DECIMAL(10, 2) NOT NULL,
  phone TEXT NOT NULL,
  location_ar TEXT NOT NULL,
  location_en TEXT NOT NULL,
  agent_name_ar TEXT NOT NULL,
  agent_name_en TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Allow public read on properties" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on notifications" ON notifications
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on contact_info" ON contact_info
  FOR SELECT USING (true);

-- Create RLS policies for admin write access
CREATE POLICY "Allow insert on properties" ON properties
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow delete on properties" ON properties
  FOR DELETE USING (true);

CREATE POLICY "Allow update on properties" ON properties
  FOR UPDATE USING (true);

CREATE POLICY "Allow insert on notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert on contact_info" ON contact_info
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on contact_info" ON contact_info
  FOR UPDATE USING (true);

-- Insert default contact info
INSERT INTO contact_info (whatsapp, phone, email)
VALUES (
  '+963901234567',
  '+963901234567',
  'info@aqari.sy'
)
ON CONFLICT DO NOTHING;

-- Set updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMPLETED!
-- ============================================
-- Now run the sample data script:
-- supabase/migrations/20260516_sample_data.sql
