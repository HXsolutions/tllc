
import { getProducts, type ProductCategory } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination"
import { Fragment } from 'react';
import { CategoryFilter } from './category-filter';
import { initializeServerSideFirebase } from '@/firebase/server-side';

type ShopPageProps = {
  searchParams: {
    category?: ProductCategory;
    page?: string;
  };
};

const PRODUCTS_PER_PAGE = 8;

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category } = searchParams;
  const page = parseInt(searchParams.page || '1', 10);
  const { firestore } = initializeServerSideFirebase();
  const { products, totalPages } = await getProducts(firestore, { category, page, limit: PRODUCTS_PER_PAGE });

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Shop</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {category || 'All Products'}
        </h1>
        <CategoryFilter currentCategory={category} />
      </div>
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12">
            <ShopPagination
              currentPage={page}
              totalPages={totalPages}
              category={category}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
}

function ShopPagination({
  currentPage,
  totalPages,
  category,
}: {
  currentPage: number;
  totalPages: number;
  category?: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (category) {
      params.set('category', category);
    }
    params.set('page', page.toString());
    return `/shop?${params.toString()}`;
  };

  const pageNumbers: React.ReactNode[] = [];
  const MAX_PAGES_SHOWN = 7;
  const HALF_PAGES_SHOWN = Math.floor(MAX_PAGES_SHOWN / 2);

  if (totalPages <= MAX_PAGES_SHOWN) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink href={createPageUrl(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  } else {
    // Always show first page
    pageNumbers.push(
      <PaginationItem key={1}>
        <PaginationLink href={createPageUrl(1)} isActive={1 === currentPage}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Ellipsis after first page
    if (currentPage > HALF_PAGES_SHOWN + 1) {
      pageNumbers.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Middle pages
    const startPage = Math.max(2, currentPage - (HALF_PAGES_SHOWN - 2));
    const endPage = Math.min(totalPages - 1, currentPage + (HALF_PAGES_SHOWN - 2));
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink href={createPageUrl(i)} isActive={i === currentPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis before last page
    if (currentPage < totalPages - HALF_PAGES_SHOWN) {
      pageNumbers.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page
    pageNumbers.push(
      <PaginationItem key={totalPages}>
        <PaginationLink href={createPageUrl(totalPages)} isActive={totalPages === currentPage}>
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
  }


  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(currentPage - 1)} />
          </PaginationItem>
        )}
        {pageNumbers}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={createPageUrl(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
