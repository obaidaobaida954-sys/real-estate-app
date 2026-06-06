export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl bg-[#1f1f1f] p-3 shadow-md overflow-hidden">
      
      {/* Image + overlay */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="h-40 w-full bg-gray-700" />

        {/* زر فوق الصورة */}
        <div className="absolute top-2 right-2 h-6 w-16 bg-gray-600 rounded-full" />

        {/* قلب */}
        <div className="absolute top-2 left-2 h-6 w-6 bg-gray-600 rounded-full" />

        {/* السعر */}
        <div className="absolute bottom-2 right-2 h-5 w-20 bg-gray-600 rounded-md" />
      </div>

      {/* Bottom section */}
      <div className="mt-4 space-y-3 px-2">
        
        {/* اسم */}
        <div className="h-4 w-1/2 bg-gray-600 rounded" />

        {/* location */}
        <div className="h-3 w-1/3 bg-gray-700 rounded" />

        {/* Icons row */}
        <div className="flex justify-between mt-3">
          <div className="h-3 w-10 bg-gray-700 rounded" />
          <div className="h-3 w-10 bg-gray-700 rounded" />
          <div className="h-3 w-10 bg-gray-700 rounded" />
        </div>

        {/* Bottom pill (مثل الناف بار تبع الكارد) */}
        <div className="mt-4 h-10 bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}