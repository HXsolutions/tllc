'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { useEffect, useState } from 'react';

export function CartIcon() {
  const { totalItems } = useCart();
  const [isClient, setIsClient] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (totalItems > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems])

  if (!isClient) {
    return (
       <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Shopping Cart</span>
        </Link>
      </Button>
    )
  }

  const animateClass = isAnimating ? 'animate-in zoom-in-150 duration-300' : '';

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        <span className="sr-only">Shopping Cart</span>
        {totalItems > 0 && (
          <Badge
            variant="default"
            className={`absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent p-0 text-xs text-accent-foreground ${animateClass}`}
          >
            {totalItems}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
