import { getProducts } from "@/lib/actions/actions";
import ProductCard from "./ProductCard";

const ProductList = async () => {
  const products = await getProducts();

  return (
    <div className="w-full max-w-7xl mx-auto px-5 py-8">
     <p className="text-heading1-bold text-center mb-6 sm:mb-8">Products</p>

      {!products || products.length === 0 ? (
        <p className="text-body-bold text-center">No products found</p>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
          {products.map((product: ProductType) => (
            <div key={product._id} className="w-full flex justify-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
