import React from "react";
import { Heart, MapPin, Ruler, BedDouble, Bath } from "lucide-react";
import { Property } from "@/lib/supabase";
import { relativeDate } from "../utils/date";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  formattedPrice: string;
  lang: "ar" | "en";
  showContactButton?: boolean;
  labels: {
    badge: string;
    rooms: string;
    baths: string;
    bath: string;
    sqm: string;
    per_month: string;
    fav_add: string;
    fav_remove: string;
  };
}

function PropertyCardInner({
  property,
  onClick,
  isFavorite,
  onToggleFavorite,
  formattedPrice,
  lang,
  labels,
  showContactButton,
}: PropertyCardProps) {
  const isFav = isFavorite;

  const title = lang === "ar" ? property.title_ar : property.title_en;
  const location = lang === "ar" ? property.location_ar : property.location_en;

  const badgeColor =
    property.type === "sale"
      ? "bg-gradient-to-br from-amber-300 to-amber-500 text-stone-900"
      : "bg-emerald-400 text-emerald-950";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="relative flex flex-col h-full rounded-[24px] overflow-hidden bg-surface-0 border border-border-subtle cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${title} — ${formattedPrice}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <motion.div className="relative h-[220px] w-full overflow-hidden p-2 pb-0 shrink-0">
        <motion.div className="relative w-full h-full rounded-[18px] overflow-hidden">
          <motion.div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10 pointer-events-none" />
          <ImageWithFallback
            src={property.image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />

          <motion.div className="absolute top-3 right-3 z-20">
            <span
              className={`text-[10px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg ${badgeColor}`}
            >
              {labels.badge}
            </span>
            {showContactButton && (
              <button className="bg-blue-500 text-white px-3 py-1 rounded">Contact</button>
            )}
          </motion.div>

          <button
            className="absolute top-3 left-3 w-10 h-10 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center z-20 transition-transform hover:scale-110 active:scale-90"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            aria-label={isFav ? labels.fav_remove : labels.fav_add}
            aria-pressed={isFav}
          >
            <Heart
              className={`w-[18px] h-[18px] transition-colors duration-300 ${
                isFav
                  ? "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                  : "text-white"
              }`}
            />
          </button>

          <motion.div className="absolute bottom-3 right-4 z-20">
            <p className="text-2xl font-bold text-white drop-shadow-xl flex items-baseline gap-1">
              {formattedPrice}
              {property.type === "rent" && (
                <span className="text-[10px] font-normal text-white/60 ml-1">
                  {labels.per_month}
                </span>
              )}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="px-5 py-4 flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <h4 className="font-bold text-text-main text-[16px] mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors">
            {title}
          </h4>

          <p className="text-text-muted text-xs truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
            {location}
          </p>
        </div>

        <motion.div className="flex items-center gap-3 text-text-muted text-xs font-medium overflow-hidden">
          {property.rooms > 0 && (
            <motion.div className="flex items-center gap-1.5 whitespace-nowrap">
              <BedDouble className="w-4 h-4 text-amber-500" />
              <span>
                {property.rooms} {labels.rooms}
              </span>
            </motion.div>
          )}

          {property.rooms > 0 && property.bathrooms > 0 && (
            <span className="w-1 h-1 rounded-full bg-border-subtle" />
          )}

          {property.bathrooms > 0 && (
            <motion.div className="flex items-center gap-1.5 whitespace-nowrap">
              <Bath className="w-4 h-4 text-amber-500" />
              <span>
                {property.bathrooms}{" "}
                {property.bathrooms > 1 ? labels.baths : labels.bath}              </span>
            </motion.div>
          )}

          {(property.rooms > 0 || property.bathrooms > 0) && (
            <span className="w-1 h-1 rounded-full bg-border-subtle" />
          )}

          <motion.div className="flex items-center gap-1.5 whitespace-nowrap">
            <Ruler className="w-4 h-4 text-amber-500" />
            <span>
              {property.area} {labels.sqm}
            </span>
          </motion.div>
        </motion.div>

        {property.created_at && (
          <p className="text-[10px] text-text-muted text-right mt-2">
            {relativeDate(property.created_at, lang)}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

const propsAreEqual = (prev: PropertyCardProps, next: PropertyCardProps) => {
  return (
    prev.property.id === next.property.id &&
    prev.isFavorite === next.isFavorite &&
    prev.formattedPrice === next.formattedPrice &&
    prev.lang === next.lang &&
    prev.showContactButton === next.showContactButton
  );
};

export const PropertyCard = React.memo(PropertyCardInner, propsAreEqual);
