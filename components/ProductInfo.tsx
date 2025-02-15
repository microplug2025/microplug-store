"use client";

import { useState, useEffect } from "react";
import HeartFavorite from "./HeartFavorite";
import { MinusCircle, PlusCircle } from "lucide-react";

import useCart from "@/lib/hooks/useCart";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
  const [selectedColor, setSelectedColor] = useState<string>(productInfo.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>(productInfo.sizes[0] || "");
  const [quantity, setQuantity] = useState<number>(1);

  const cart = useCart();

  // Log the product details to inspect the structure
  useEffect(() => {
    console.log("Product Details:", productInfo);
  }, [productInfo]);

  // Check if the product is out of stock
  const isOutOfStock = productInfo.quantity === 0;

  return (
    <div className="max-w-[400px] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="text-heading3-bold">{productInfo.title}</p>
        <HeartFavorite product={productInfo} />
      </div>

      <div className="flex gap-2">
        <p className="text-base-medium text-grey-2">Category:</p>
        <p className="text-base-bold">{productInfo.category}</p>
      </div>

      <p className="text-heading3-bold"> 
        <span className="text-green-500">ksh </span> {productInfo.price}
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-base-medium text-grey-2">Description:</p>
        <p className="text-small-medium">{productInfo.description}</p>
      </div>

      {productInfo.colors && productInfo.colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-base-medium text-grey-2">Colors:</p>
          <div className="flex gap-2">
            {productInfo.colors.map((color, index) => (
              <p
                key={index}
                className={`border border-black px-2 py-1 rounded-lg cursor-pointer ${
                  selectedColor === color && "bg-black text-white"
                }`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </p>
            ))}
          </div>
        </div>
      )}

      {productInfo.sizes && productInfo.sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-base-medium text-grey-2">Sizes:</p>
          <div className="flex gap-2">
            {productInfo.sizes.map((size, index) => (
              <p
                key={index}
                className={`border border-black px-2 py-1 rounded-lg cursor-pointer ${
                  selectedSize === size && "bg-black text-white"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-base-medium text-grey-2">Quantity:</p>
        <div className="flex gap-4 items-center">
          <MinusCircle
            className="hover:text-red-1 cursor-pointer"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
          />
          <p className="text-body-bold">{quantity}</p>
          <PlusCircle
            className="hover:text-red-1 cursor-pointer"
            onClick={() => setQuantity(quantity + 1)}
          />
        </div>
      </div>

      {/* Display "Out of Stock" if product quantity is 0 */}
      {isOutOfStock ? (
        <p className="text-red-500 text-base-bold">Out of Stock</p>
      ) : (
        <button
          className="outline text-base-bold py-3 rounded-lg hover:bg-black hover:text-white"
          onClick={() => {
            cart.addItem({
              item: productInfo,
              quantity,
              color: selectedColor,
              size: selectedSize,
            });
          }}
        >
          Add To Cart
        </button>
      )}

      {/* Show Datasheet download link if available */}
      {productInfo.datasheet && (
        <div className="mt-4">
          <p className="text-base-medium text-grey-2">Datasheet:</p>
          <a
            href={productInfo.datasheet}
            download // Adding the download attribute to trigger file download
            className="text-blue-500 underline"
          >
            Download Datasheet
          </a>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
