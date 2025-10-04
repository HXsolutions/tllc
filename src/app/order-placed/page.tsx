'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function OrderPlacedPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-center">
            <CheckCircle className="mr-2 h-8 w-8 text-green-500" />
            <span className="text-2xl font-bold tracking-tight font-headline">
              Thank You for Your Order!
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Your order has been placed successfully.
          </p>
          <p className="mt-2 text-muted-foreground">
            A confirmation email has been sent to you.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
