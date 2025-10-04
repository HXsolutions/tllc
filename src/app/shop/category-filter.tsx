'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import type { ProductCategory } from '@/lib/products';

const categories: ProductCategory[] = ['Home Accessories', 'Kitchen', 'Beauty'];

export function CategoryFilter({
  currentCategory,
}: {
  currentCategory?: ProductCategory;
}) {
  const router = useRouter();

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      router.push('/shop');
    } else {
      router.push(`/shop?category=${encodeURIComponent(value)}`);
    }
  };

  return (
    <Select
      value={currentCategory || 'all'}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat} value={cat}>
            {cat}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
