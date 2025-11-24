import { Suspense } from "react";
import ProductsPage from "./productPage";


export default function Page() {
  return (
    <Suspense fallback={<div>در حال بارگذاری محصولات...</div>}>
      <ProductsPage />
    </Suspense>
  );
}
  