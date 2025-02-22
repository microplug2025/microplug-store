import { getProducts } from "@/lib/actions/actions";
import ProductCard from "./ProductCard";

const ProductList = async () => {
  const products = await getProducts();

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5">
      <p className="text-heading1-bold">Products</p>
      {!products || products.length === 0 ? (
        <p className="text-body-bold">No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product:ProductType) => (
            <div key={product._id} className="sm:scale-100 scale-[0.95] transition-transform">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
