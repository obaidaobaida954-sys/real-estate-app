import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  MapPin,
  X,
  BedDouble,
  Bath,
  Ruler,
  Phone,
  MessageCircle,
  Share2,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { toast } from "sonner";
import { Property } from "@/lib/supabase";
import { useAppContext } from "../context/AppContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import PropertyMap from "./PropertyMap";
import { CONTACT } from "../config/contact";

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyModal({
  property,
  isOpen,
  onClose,
}: PropertyModalProps) {
  const { t, lang, favorites, toggleFavorite, formatPrice } = useAppContext();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (isOpen && emblaApi) {
      emblaApi.scrollTo(0);
      setSelectedIndex(0);
    }
  }, [isOpen, property?.id, emblaApi]);

  if (!property) return null;

  const isFav = favorites.has(property.id);
  const title = lang === "ar" ? property.title_ar : property.title_en;
  const location = lang === "ar" ? property.location_ar : property.location_en;
  const agentName =
    lang === "ar" ? property.agent_name_ar : property.agent_name_en;
  const description =
    lang === "ar" ? property.description_ar : property.description_en;
  const phoneValue = property.phone || CONTACT.phone;

  const handleShare = async () => {
    const shareText = `${title} - ${location}`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url,
        });
        return;
      } catch {
        // fallback below
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("share_copied"));
    } catch {
      toast.error(t("share_failed"));
    }
  };

  const images = [property.image_url, ...(property.image_urls || [])].filter(
    Boolean,
  );

  const badge = property.type === "sale" ? "badge_sale" : "badge_rent";
  const badgeColor =
    property.type === "sale"
      ? "bg-gradient-to-br from-amber-300 to-amber-500 text-stone-900"
      : "bg-emerald-400 text-emerald-950";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[70] w-full max-w-md mx-auto bg-surface-0 rounded-t-[32px] overflow-hidden max-h-[92vh] flex flex-col shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-white/30 z-20" />

            <div className="overflow-y-auto overflow-x-hidden flex-1 pb-28">
              <div className="relative h-80 w-full bg-black">
                <div ref={emblaRef} className="overflow-hidden h-full">
                  <div className="flex h-full">
                    {images.map((src, idx) => (
                      <div
                        key={`${src}-${idx}`}
                        className="flex-[0_0_100%] min-w-0 h-full"
                      >
                        <ImageWithFallback
                          src={src}
                          alt={`${title} ${idx + 1}`}
                          className="w-full h-full object-cover"
                          fadeIn
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {images.length > 1 && (
                  <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => emblaApi?.scrollTo(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === selectedIndex
                            ? "bg-amber-500 w-4"
                            : "bg-white/50"
                        }`}
                        aria-label={`Image ${idx + 1}`}
                      />
                    ))}
                  </motion.div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-transparent to-black/30 pointer-events-none" />

                <button
                  className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center z-20 transition-transform hover:scale-110 active:scale-90 text-white hover:text-amber-500"
                  onClick={onClose}
                  aria-label={t("close")}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                  <button
                    className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
                    onClick={handleShare}
                    aria-label={t("share")}
                  >
                    <Share2 className="w-5 h-5 text-white" aria-hidden="true" />
                  </button>
                  <button
                    className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
                    onClick={() => toggleFavorite(property.id)}
                    aria-label={isFav ? t("fav_remove") : t("fav_add")}
                    aria-pressed={isFav}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isFav
                          ? "fill-red-500 text-red-500"
                          : "text-white hover:text-red-400"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <div className="absolute bottom-6 right-6 z-10">
                  <span
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg ${badgeColor}`}
                  >
                    {t(badge)}
                  </span>
                </div>
              </div>

              <div className="px-6 pt-4">
                <div className="flex items-start justify-between mb-4 gap-3">
                  <h2 className="text-2xl font-extrabold text-text-main leading-tight">
                    {title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 mb-8">
                  <span className="text-2xl font-bold text-amber-500 whitespace-nowrap">
                    {formatPrice(property.price)}
                  </span>
                  {property.type === "rent" && (
                    <span className="text-sm font-medium text-text-muted bg-surface-1 px-2 py-1 rounded-lg">
                      {t("per_month")}
                    </span>
                  )}
                </div>

                <p className="text-text-muted text-sm mb-8 flex items-center gap-2 bg-surface-1 p-3 rounded-xl border border-border-subtle">
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0" />
                  {location}
                </p>

                {description && (
                  <div className="mb-6 p-4 rounded-2xl bg-surface-1 border border-border-subtle">
                    <p className="text-[10px] text-text-muted mb-2 uppercase tracking-[0.2em] font-bold">
                      {t("prop_description")}
                    </p>
                    <p className="text-text-main text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mb-8">
                  {property.rooms > 0 && (
                    <div className="flex-1 bg-surface-1 rounded-2xl p-4 flex flex-col items-center justify-center border border-border-subtle">
                      <BedDouble className="w-6 h-6 text-amber-500 mb-2 opacity-80" />
                      <p className="text-xl font-bold text-text-main">
                        {property.rooms}
                      </p>
                      <p className="text-[11px] text-text-muted mt-1 font-medium">
                        {t("rooms")}
                      </p>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <motion.div className="flex-1 bg-surface-1 rounded-2xl p-4 flex flex-col items-center justify-center border border-border-subtle">
                      <Bath className="w-6 h-6 text-amber-500 mb-2 opacity-80" />
                      <p className="text-xl font-bold text-text-main">
                        {property.bathrooms}
                      </p>
                      <p className="text-[11px] text-text-muted mt-1 font-medium">
                        {property.bathrooms > 1 ? t("baths") : t("bath")}
                      </p>
                    </motion.div>
                  )}
                  <div className="flex-1 bg-surface-1 rounded-2xl p-4 flex flex-col items-center justify-center border border-border-subtle">
                    <Ruler className="w-6 h-6 text-amber-500 mb-2 opacity-80" />
                    <p className="text-xl font-bold text-text-main">
                      {property.area}
                    </p>
                    <p className="text-[11px] text-text-muted mt-1 font-medium">
                      {t("sqm")}
                    </p>
                  </div>
                </div>

                {agentName && (
                  <div className="bg-gradient-to-br from-surface-1 to-surface-2 rounded-2xl p-5 mb-6 border border-border-subtle relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
                    <p className="text-[10px] text-text-muted mb-2 uppercase tracking-[0.2em] font-bold">
                      {t("estate_office")}
                    </p>
                    <p className="text-text-main font-bold text-lg mb-1 relative z-10">
                      {agentName}
                    </p>
                    <p
                      className="text-amber-500 text-sm font-mono tracking-wider relative z-10"
                      dir="ltr"
                    >
                      {phoneValue}
                    </p>
                    <a
                      href={`https://wa.me/${phoneValue.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-medium shadow-md"
                      aria-label={t("modal_whatsapp")}
                    >
                      <MessageCircle className="w-5 h-5" aria-hidden="true" />
                      <span>{t("modal_whatsapp")}</span>
                    </a>
                  </div>
                )}

                {property.lat != null && property.lng != null && (
                  <div className="mb-6">
                    <p className="text-[10px] text-text-muted mb-3 uppercase tracking-[0.2em] font-bold px-1">
                      {t("location_map")}
                    </p>
                    <PropertyMap
                      lat={property.lat}
                      lng={property.lng}
                      title={title}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-surface-0/90 backdrop-blur-xl border-t border-border-subtle p-4 px-6 flex gap-3 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
              <a
                href={`tel:${phoneValue.replace(/\D/g, "")}`}
                className="flex-1 btn-premium py-4 rounded-[18px] font-bold text-base flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                {t("modal_call")}
              </a>
              <a
                href={`https://wa.me/${phoneValue.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 shrink-0 bg-emerald-500 text-white rounded-[18px] flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                aria-label={t("modal_whatsapp")}
              >
                <MessageCircle className="w-6 h-6" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
