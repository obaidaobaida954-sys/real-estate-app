/*
  # Create Properties, Notifications, and Contact Info Tables

  ## Overview
  This migration creates the core database schema for the real estate application including properties listings, notifications system, and contact information management.

  ## Tables Created

  ### 1. properties
  Main table for property listings with bilingual support (Arabic/English).
  - id: UUID primary key
  - title_ar, title_en: Property titles in Arabic and English
  - type: "sale" or "rent"
  - category: "house", "apartment", "commercial", or "land"
  - price: Numeric price value
  - rooms, bathrooms: Count of rooms and bathrooms
  - area: Property area in square meters
  - phone: Contact phone number
  - location_ar, location_en: Location descriptions in both languages
  - agent_name_ar, agent_name_en: Agent name in both languages
  - image_url: URL to property image
  - created_at: Timestamp when property was added

  ### 2. notifications
  System notifications table for user alerts.
  - id: UUID primary key
  - title: Notification title
  - message: Notification message content
  - created_at: Timestamp when notification was created

  ### 3. contact_info
  Single record table for business contact information.
  - id: UUID primary key
  - whatsapp: WhatsApp contact number
  - phone: Primary phone number
  - email: Business email address
  - created_at: Timestamp when record was created

  ## Security
  RLS (Row Level Security) is enabled on all tables:
  - properties: All authenticated and anonymous users can read; creation/modification restricted
  - notifications: All authenticated and anonymous users can read; creation restricted
  - contact_info: All authenticated and anonymous users can read; modification restricted to service role

  ## Defaults
  - Initial contact_info record inserted with sample values
*/

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
  category TEXT NOT NULL CHECK (category IN ('house', 'apartment', 'commercial', 'land')),
  price NUMERIC NOT NULL DEFAULT 0,
  rooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  area NUMERIC NOT NULL DEFAULT 0,
  phone TEXT NOT NULL DEFAULT '',
  location_ar TEXT NOT NULL DEFAULT '',
  location_en TEXT NOT NULL DEFAULT '',
  agent_name_ar TEXT NOT NULL DEFAULT '',
  agent_name_en TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties table
CREATE POLICY "Anyone can read properties"
  ON properties
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can insert properties"
  ON properties
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update properties"
  ON properties
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete properties"
  ON properties
  FOR DELETE
  TO service_role
  USING (true);

-- RLS Policies for notifications table
CREATE POLICY "Anyone can read notifications"
  ON notifications
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can insert notifications"
  ON notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can delete notifications"
  ON notifications
  FOR DELETE
  TO service_role
  USING (true);

-- RLS Policies for contact_info table
CREATE POLICY "Anyone can read contact_info"
  ON contact_info
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service role can update contact_info"
  ON contact_info
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert default contact_info record
INSERT INTO contact_info (whatsapp, phone, email) 
VALUES ('+963123456789', '+963123456789', 'info@aqari.sy')
ON CONFLICT DO NOTHING;

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS properties_type_category_idx ON properties(type, category);
CREATE INDEX IF NOT EXISTS properties_created_at_idx ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);