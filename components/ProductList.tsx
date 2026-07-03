// components/ProductList.tsx (server)
import { getProducts } from "@/lib/actions/actions";
import ProductListClient from "./ProductListClient";

export default async function ProductList() {
  const products = await getProducts();
  return <ProductListClient products={products} />;
}