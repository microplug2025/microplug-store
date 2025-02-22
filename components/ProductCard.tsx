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
      className="w-[220px] sm:w-[160px] xs:w-[130px] flex flex-col gap-1"
    >
      <Image
        src={product.media[0]}
        alt="product"
        width={250}
        height={300}
        className="h-[250px] sm:h-[200px] xs:h-[160px] rounded-lg object-cover"
      />
      <div>
        <p className="text-base sm:text-sm xs:text-[10px] font-bold">{product.title}</p>
        <p className="text-sm sm:text-xs xs:text-[9px] text-grey-2">{product.category}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-body-bold sm:text-sm xs:text-[9px]">
          <span className="text-slate-600">ksh </span> {product.price}
        </p>
        <HeartFavorite product={product} updateSignedInUser={updateSignedInUser} />
      </div>
    </Link>
  );
};

export default ProductCard;
