
'use server';

import { getProductRecommendations } from '@/ai/flows/ai-product-recommendations';
import type { CartItem } from '@/context/cart-context';
import { getProducts, getAllProducts } from '@/lib/products';
import { initializeServerSideFirebase } from '@/firebase/server-side';
import type { Product } from '@/lib/products';

export async function fetchRecommendations(cartItems: CartItem[]): Promise<Product[]> {
  if (cartItems.length === 0) {
    return [];
  }

  try {
    const { firestore } = initializeServerSideFirebase();
    const allProducts = await getAllProducts(firestore);
    const allProductsMap = new Map(allProducts.map(p => [p.id, p]));

    const cartContentsForAI = cartItems.map(item => {
      const productDetails = allProductsMap.get(item.id);
      return {
        id: item.id,
        name: item.name,
        description: productDetails?.description || '',
        imageUrl: productDetails?.imageUrls[0] || '',
      };
    });

    const response = await getProductRecommendations({
      cartContents: cartContentsForAI,
      allProducts: allProducts.map(p => ({id: p.id, name: p.name, description: p.description, imageUrl: p.imageUrls[0]}))
    });

    // Filter out products that are already in the cart
    const cartIds = new Set(cartItems.map(item => item.id));
    const recommendedProducts = response.recommendations
      .map(rec => allProductsMap.get(rec.id))
      .filter((p): p is Product => p !== undefined && !cartIds.has(p.id));
      
    return recommendedProducts;

  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    // Return an empty array or throw a custom error to be handled by the client
    return [];
  }
}
