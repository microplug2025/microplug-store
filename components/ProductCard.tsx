"use client";

import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  return (
    <Link
      href={`/products/${product._id}`}
      className="w-[200px] xs:w-[180px] sm:w-[220px] flex flex-col gap-1.5 sm:gap-2"
    >
      <Image
        src={product.media[0]}
        alt="product"
        width={250}
        height={300}
        className="h-[220px] xs:h-[200px] sm:h-[250px] rounded-lg object-cover"
      />
      <div>
        <p className="text-sm xs:text-xs sm:text-base font-bold">{product.title}</p>
        <p className="text-xs xs:text-[10px] sm:text-sm text-grey-2">{product.category}</p>
      </div>
      <div className="flex justify-between items-center gap-[2px] xs:gap-0 sm:gap-1">
        <p className="text-sm xs:text-xs sm:text-body-bold">
          <span className="text-slate-600">ksh</span> {product.price}
        </p>
        <HeartFavorite product={product} updateSignedInUser={updateSignedInUser} />
      </div>
    </Link>
  );
};

export default ProductCard;
