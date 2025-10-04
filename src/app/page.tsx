
import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/product-card';
import { getProducts, type ProductCategory } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { initializeServerSideFirebase } from '@/firebase/server-side';

const categoryDetails: Record<ProductCategory, { imageHint: string; description: string; }> = {
  'Home Accessories': {
    imageHint: 'modern living room',
    description: 'Elevate your space with our curated collection of home accessories.'
  },
  'Kitchen': {
    imageHint: 'modern kitchen',
    description: 'Discover functional and beautiful essentials for your kitchen.'
  },
  'Beauty': {
    imageHint: 'beauty products shelf',
    description: 'Natural and effective beauty products for your daily routine.'
  }
};


export default async function Home() {
  const { firestore } = initializeServerSideFirebase();
  const { products: featuredProducts } = await getProducts(firestore, { limit: 4 });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzb2Z0JTIwbWluaW1hbGlzdCUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzU5MzgxNTc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Minimalist interior"
          fill
          className="object-cover"
          data-ai-hint="soft minimalist background"
        />
        <div className="absolute inset-0 bg-background/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-foreground">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl font-headline">
            Live with intention.
          </h1>
          <p className="mt-4 max-w-2xl text-lg">
            Discover curated goods for a mindful, modern lifestyle.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/shop">Shop All</Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-3xl font-bold tracking-tight text-center font-headline">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {(Object.keys(categoryDetails) as ProductCategory[]).map((category) => {
            const details = categoryDetails[category];
            const placeholderImage = PlaceHolderImages.find(p => p.imageHint === details.imageHint)
            return (
              <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} className="group relative block overflow-hidden rounded-lg">
                <Image
                  src={placeholderImage?.imageUrl || `https://picsum.photos/seed/${category}/600/400`}
                  alt={category}
                  width={600}
                  height={400}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={details.imageHint}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
                  <h3 className="text-2xl font-bold font-headline">{category}</h3>
                  <p className="mt-2 text-sm">{details.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-12 text-3xl font-bold tracking-tight text-center font-headline">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
                <Link href="/shop">View All Products</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
