"use client";

import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";
import { ShoppingCart, Eye, Zap } from "lucide-react";
import useCart from "@/lib/hooks/useCart";
import { useState } from "react";
import { ProductType, UserType } from "@/lib/types";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  const cart = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const isOutOfStock = product.quantity === 0;

  const hasDiscount =
    product.comparePrice != null &&
    product.comparePrice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.comparePrice! - product.price) / product.comparePrice!) * 100
      )
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    setIsAdding(true);

    const selectedColor = product.colors?.[0] || "";
    const selectedSize = product.sizes?.[0] || "";

    cart.addItem({
      item: product,
      quantity: 1,
      color: selectedColor,
      size: selectedSize,
    });

    setTimeout(() => setIsAdding(false), 1200);
  };

  return (
    <div
      className="group relative w-[260px] sm:w-[200px] xs:w-[160px] flex flex-col gap-3 transition-all duration-500 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE WRAPPER */}
      <div className="relative block overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Discount Badge */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute top-3 left-3 z-30 bg-gradient-to-r from-red-500 via-pink-500 to-rose-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-xl animate-pulse">
            -{discountPercent}%
          </div>
        )}

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 right-3 z-30 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
            Out of Stock
          </div>
        )}

        {/* NEW Badge */}
        {product.isNew && !isOutOfStock && !hasDiscount && (
          <div className="absolute top-3 left-3 z-30 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
            <span className="flex items-center gap-1">
              <Zap size={10} /> NEW
            </span>
          </div>
        )}

        {/* Floating Heart - Outside the Link to prevent nesting issues */}
        <div 
          className="absolute top-3 right-3 z-30" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full p-2 shadow-lg">
            <HeartFavorite
              product={product}
              updateSignedInUser={updateSignedInUser}
            />
          </div>
        </div>

        {/* Clickable Image Area */}
        <Link href={`/products/${product._id}`}>
          <Image
            src={product.media[0]}
            alt={product.title}
            width={280}
            height={340}
            className={`h-[280px] sm:h-[220px] xs:h-[180px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
              isOutOfStock ? "grayscale opacity-60" : ""
            }`}
          />
        </Link>

        {/* Shine Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-[150%] transition-all duration-1000" />
        </div>

        {/* HOVER ACTIONS - No nested Link */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end items-center pb-6 gap-3 transition-all duration-300 ${
            isHovered && !isOutOfStock ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 bg-white/95 text-slate-900 text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg">
            <Eye size={14} />
            Quick View
          </div>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="flex flex-col gap-1 px-1">
        {/* CATEGORY */}
        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">
          {product.category}
        </p>

        {/* TITLE */}
        <Link href={`/products/${product._id}`}>
          <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-orange-600 transition">
            {product.title}
          </p>
        </Link>

        {/* RATING */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating!)
                    ? "text-amber-400"
                    : "text-slate-200"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-[10px] text-slate-400 ml-1">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* PRICE */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-full px-3 py-1.5 w-fit">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            <span className="text-orange-600">ksh </span>
            {product.price.toLocaleString()}
          </p>

          {hasDiscount && (
            <p className="text-[11px] text-slate-400 line-through">
              ksh {product.comparePrice!.toLocaleString()}
            </p>
          )}
        </div>

        {/* ADD TO CART (ALWAYS VISIBLE ORANGE BUTTON) */}
        {!isOutOfStock ? (
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className={`mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-sm shadow-lg transition-all duration-300 ${
              isAdding
                ? "bg-emerald-500 text-white"
                : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:-translate-y-0.5"
            }`}
          >
            {isAdding ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Added
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                Add to Cart
              </>
            )}
          </button>
        ) : (
          <button
            disabled
            className="mt-3 w-full rounded-xl py-3 bg-slate-200 text-slate-500 font-semibold cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;