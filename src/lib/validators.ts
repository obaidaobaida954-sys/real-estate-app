/**
 * Validation utilities for Property data
 */

import { Property } from "./supabase";

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Check if string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if string is a valid phone number (basic validation)
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone || typeof phone !== "string") return false;
  // قبول أرقام بصيغ مختلفة
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
  return phoneRegex.test(phone);
};

/**
 * Check if string is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize string input (remove dangerous characters)
 */
export const sanitizeString = (input: string): string => {
  if (!input) return "";
  return String(input)
    .trim()
    .replace(/[<>]/g, ""); // إزالة HTML tags
};

/**
 * Validate positive number
 */
export const isValidPrice = (price: number): boolean => {
  return typeof price === "number" && !isNaN(price) && price > 0;
};

/**
 * Validate non-negative integer
 */
export const isValidCount = (count: number): boolean => {
  return Number.isInteger(count) && count >= 0;
};

/**
 * Validate Property before insertion
 */
export const validateProperty = (
  property: Partial<Property>
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate title_ar
  const titleAr = sanitizeString(property.title_ar || "");
  if (!titleAr || titleAr.length < 3) {
    errors.push({
      field: "title_ar",
      message: "العنوان بالعربية يجب أن يكون 3 أحرف على الأقل",
    });
  }
  if (titleAr.length > 100) {
    errors.push({
      field: "title_ar",
      message: "العنوان بالعربية لا يجب أن يتجاوز 100 حرف",
    });
  }

  // Validate title_en
  const titleEn = sanitizeString(property.title_en || "");
  if (!titleEn || titleEn.length < 3) {
    errors.push({
      field: "title_en",
      message: "Title must be at least 3 characters",
    });
  }
  if (titleEn.length > 100) {
    errors.push({
      field: "title_en",
      message: "Title must not exceed 100 characters",
    });
  }

  // Validate type
  if (!property.type || !["sale", "rent"].includes(property.type)) {
    errors.push({
      field: "type",
      message: "نوع العقار غير صحيح (بيع أو إيجار)",
    });
  }

  // Validate category
  if (
    !property.category ||
    !["house", "apartment", "commercial", "land"].includes(property.category)
  ) {
    errors.push({
      field: "category",
      message: "فئة العقار غير صحيحة",
    });
  }

  // Validate price
  if (!isValidPrice(property.price)) {
    errors.push({
      field: "price",
      message: "السعر يجب أن يكون أكبر من 0",
    });
  }

  // Validate rooms
  if (!isValidCount(property.rooms ?? 0)) {
    errors.push({
      field: "rooms",
      message: "عدد الغرف غير صحيح",
    });
  }

  // Validate bathrooms
  if (!isValidCount(property.bathrooms ?? 0)) {
    errors.push({
      field: "bathrooms",
      message: "عدد الحمامات غير صحيح",
    });
  }

  // Validate area
  if (
    !property.area ||
    typeof property.area !== "number" ||
    property.area <= 0
  ) {
    errors.push({
      field: "area",
      message: "المساحة يجب أن تكون أكبر من 0",
    });
  }

  // Validate phone
  if (!isValidPhone(property.phone || "")) {
    errors.push({
      field: "phone",
      message: "رقم الهاتف غير صحيح",
    });
  }

  // Validate location_ar
  const locationAr = sanitizeString(property.location_ar || "");
  if (!locationAr) {
    errors.push({
      field: "location_ar",
      message: "الموقع بالعربية مطلوب",
    });
  }

  // Validate location_en
  const locationEn = sanitizeString(property.location_en || "");
  if (!locationEn) {
    errors.push({
      field: "location_en",
      message: "Location is required",
    });
  }

  // Validate agent_name_ar
  const agentAr = sanitizeString(property.agent_name_ar || "");
  if (!agentAr) {
    errors.push({
      field: "agent_name_ar",
      message: "اسم الوكيل بالعربية مطلوب",
    });
  }

  // Validate agent_name_en
  const agentEn = sanitizeString(property.agent_name_en || "");
  if (!agentEn) {
    errors.push({
      field: "agent_name_en",
      message: "Agent name is required",
    });
  }

  // Validate image_url
  if (!isValidUrl(property.image_url || "")) {
    errors.push({
      field: "image_url",
      message: "رابط الصورة غير صحيح",
    });
  }

  const descAr = sanitizeString(property.description_ar || "");
  if (descAr && descAr.length > 500) {
    errors.push({
      field: "description_ar",
      message: "الوصف بالعربية لا يجب أن يتجاوز 500 حرف",
    });
  }

  const descEn = sanitizeString(property.description_en || "");
  if (descEn && descEn.length > 500) {
    errors.push({
      field: "description_en",
      message: "Description must not exceed 500 characters",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate contact info
 */
export const validateContactInfo = (info: {
  whatsapp?: string;
  phone?: string;
  email?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!isValidPhone(info.whatsapp || "")) {
    errors.push({
      field: "whatsapp",
      message: "رقم واتساب غير صحيح",
    });
  }

  if (!isValidPhone(info.phone || "")) {
    errors.push({
      field: "phone",
      message: "رقم الهاتف غير صحيح",
    });
  }

  if (!isValidEmail(info.email || "")) {
    errors.push({
      field: "email",
      message: "البريد الإلكتروني غير صحيح",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate notification
 */
export const validateNotification = (notification: {
  title?: string;
  message?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const title = sanitizeString(notification.title || "");
  if (!title || title.length < 3) {
    errors.push({
      field: "title",
      message: "عنوان الإشعار يجب أن يكون 3 أحرف على الأقل",
    });
  }

  const message = sanitizeString(notification.message || "");
  if (!message || message.length < 5) {
    errors.push({
      field: "message",
      message: "نص الإشعار يجب أن يكون 5 أحرف على الأقل",
    });
  }

  if (message.length > 500) {
    errors.push({
      field: "message",
      message: "نص الإشعار لا يجب أن يتجاوز 500 حرف",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
