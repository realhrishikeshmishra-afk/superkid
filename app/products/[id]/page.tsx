import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailsClient from "@/components/ProductDetailsClient";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id: id },
    include: { category: true }
  });

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: { 
        categoryId: product.categoryId,
        NOT: { id: product.id }
    },
    take: 4,
    include: { category: true }
  });

  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}
