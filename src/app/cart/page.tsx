
'use client';

import { CartView } from '@/components/cart-view';
import { useCart } from '@/hooks/use-cart';

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-center font-headline">
        Shopping Cart
      </h1>
      <div className="grid grid-cols-1 gap-12 lg:items-start">
        <div className="lg:col-span-3">
          <CartView />
        </div>
      </div>
    </div>
  );
}

