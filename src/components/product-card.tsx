import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/products';
import { Button } from './ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Use the first image as the primary display image
  const displayImage = product.imageUrls[0];
  const displayImageHint = product.imageHints[0];

  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="aspect-square overflow-hidden">
            <Image
              src={displayImage}
              alt={product.name}
              width={800}
              height={800}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={displayImageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <CardTitle className="text-lg font-medium tracking-normal font-headline mt-1">
            {product.name}
          </CardTitle>
           <p className="text-base font-semibold text-foreground mt-2">
            {formatPrice(product.price)}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Button variant="outline" className="w-full">Select Options</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
