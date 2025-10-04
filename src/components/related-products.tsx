
'use client';

import { useEffect, useState } from 'react';
import { getProducts, type Product, type ProductCategory } from '@/lib/products';
import { ProductCard } from './product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from './ui/skeleton';
import { useFirestore } from '@/firebase';

interface RelatedProductsProps {
  productId: string;
  category: ProductCategory;
}

export function RelatedProducts({ productId, category }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const firestore = useFirestore();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!firestore) return;
      setLoading(true);
      try {
        const { products } = await getProducts(firestore, { category });
        const related = products
          .filter((p) => p.id !== productId)
          .slice(0, 6);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Failed to fetch related products", error);
      }
      setLoading(false);
    };

    fetchRelatedProducts();
  }, [productId, category, firestore]);

  if (loading) {
    return (
      <div>
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-center font-headline">Related Products</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold tracking-tight text-center font-headline">Related Products</h2>
      <Carousel
        opts={{
          align: 'start',
          loop: relatedProducts.length > 3,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {relatedProducts.map((product) => (
            <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
