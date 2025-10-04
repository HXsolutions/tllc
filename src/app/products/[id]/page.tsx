
'use client';

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { AddToCart } from '@/components/add-to-cart';
import { RelatedProducts } from '@/components/related-products';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/products';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/firebase';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const firestore = useFirestore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (typeof params.id === 'string' && firestore) {
        try {
          const fetchedProduct = await getProductById(firestore, params.id);
          if (fetchedProduct) {
            setProduct(fetchedProduct);
          }
        } catch (error) {
          console.error("Failed to fetch product", error);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [params.id, firestore]);


  if (loading) {
     return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          <div>
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="mt-4 grid grid-cols-5 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="mt-4 h-8 w-1/4" />
            <Skeleton className="mt-4 h-24 w-full" />
            <Skeleton className="mt-8 h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return notFound();
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
         <div>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <Image
              src={product.imageUrls[activeImage]}
              alt={product.name}
              width={800}
              height={800}
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-5 gap-4">
            {product.imageUrls.map((src, index) => (
              <button
                key={src}
                onClick={() => setActiveImage(index)}
                className={cn(
                  "overflow-hidden rounded-lg border-2 transition-all",
                  activeImage === index ? "border-ring" : "border-transparent"
                )}
              >
                <Image
                  src={src}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={150}
                  height={150}
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight font-headline lg:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold lg:text-3xl">
            {formatPrice(product.price)}
          </p>
          <p className="mt-4 text-base text-muted-foreground lg:text-lg">
            {product.description}
          </p>
          <div className="mt-8">
            <AddToCart product={product} />
          </div>
        </div>
      </div>
      <div className="mt-16">
        <RelatedProducts productId={product.id} category={product.category} />
      </div>
    </div>
  );
}
