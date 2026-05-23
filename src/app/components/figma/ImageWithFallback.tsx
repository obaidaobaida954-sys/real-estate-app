import React, { useState, useEffect } from "react";
import { getOptimizedImageUrl } from "@/lib/images";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement> & { fadeIn?: boolean },
) {
  const [didError, setDidError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, loading, fadeIn = false, ...rest } = props;
  const optimizedSrc = getOptimizedImageUrl(
    typeof src === "string" ? src : undefined,
    800,
  );

  useEffect(() => {
    setLoaded(false);
    setDidError(false);
  }, [src, optimizedSrc]);

  const effectiveAlt = alt ?? "";
  const effectiveLoading = loading ?? "lazy";

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img
          src={ERROR_IMG_SRC}
          alt=""
          role="presentation"
          {...rest}
          data-original-url={src}
          loading={effectiveLoading}
          decoding="async"
        />
      </div>
    </div>
  ) : (
    <img
      src={optimizedSrc || src}
      alt={effectiveAlt}
      className={`${className ?? ""} ${fadeIn ? "transition-opacity duration-500" : ""} ${fadeIn && !loaded ? "opacity-0" : fadeIn ? "opacity-100" : ""}`}
      style={style}
      loading={effectiveLoading}
      decoding="async"
      {...rest}
      onLoad={() => fadeIn && setLoaded(true)}
      onError={handleError}
    />
  );
}
