
'use client';

import { useEffect, useState } from 'react';
import type { CartItem } from '@/context/cart-context';
import type { Product } from '@/lib/products';
import { fetchRecommendations } from '@/app/cart/actions';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface RecommendationsProps {
  cartItems: CartItem[];
}

export function Recommendations({ cartItems }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cartItems.length > 0) {
      const getRecs = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await fetchRecommendations(cartItems);
          setRecommendations(result);
        } catch (e) {
          console.error('Failed to fetch recommendations:', e);
          setError('Could not load recommendations.');
        } finally {
          setIsLoading(false);
        }
      };
      getRecs();
    } else {
      setRecommendations([]);
    }
  }, [cartItems]);

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="lg:col-span-3 mt-12">
      <h2 className="mb-8 text-3xl font-bold tracking-tight text-center font-headline">You Might Also Like</h2>
      {isLoading && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      )}
      {error && <p className="text-destructive text-center">{error}</p>}
      {!isLoading && !error && recommendations.length > 0 && (
         <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {recommendations.map((product) => (
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
      )}
      {!isLoading && !error && recommendations.length === 0 && (
          <p className="text-muted-foreground text-sm text-center">No recommendations available at the moment.</p>
      )}
    </div>
  );
}
