// app/admin/products/edit/[slug]/page.jsx
import EditProductClient from "./EditProductClient";

export default async function EditProductPage({ params }) {
  const { slug } = await params; // ✅ must await
  return <EditProductClient slug={slug} />;
}
