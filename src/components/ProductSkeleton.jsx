import React from "react";

function ProductSkeleton() {
  return (
    <div className="bg-black border border-white/10 rounded-xl overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-32 bg-gray-500" />

      {/* Text placeholders */}
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-500 rounded w-3/4" />
        <div className="h-4 bg-gray-500 rounded w-1/2" />
      </div>
    </div>
  );
}

export default ProductSkeleton;
