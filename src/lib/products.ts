
import { collection, getDocs, getDoc, doc, query, where, limit, startAt, orderBy, getCountFromServer, Firestore, updateDoc, addDoc, deleteDoc, setDoc, SetOptions } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


export type ProductCategory = 'Home Accessories' | 'Kitchen' | 'Beauty';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  imageHints: string[];
  category: ProductCategory;
};

export type GetProductsResult = {
  products: Product[];
  totalPages: number;
  totalProducts: number;
}

export async function getProducts(db: Firestore, options: {category?: ProductCategory, page?: number, limit?: number} = {}): Promise<GetProductsResult> {
    const { category, page = 1, limit: pageLimit = 8 } = options;
    const productsRef = collection(db, 'products');

    // Base query
    let q = query(productsRef);
    
    // Server-side filtering has issues. Let's fetch all and filter in memory.
    const querySnapshot = await getDocs(q);
    const allProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    // Apply category filter if it exists
    const filteredProducts = category 
        ? allProducts.filter(p => p.category === category)
        : allProducts;

    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / pageLimit);
    
    // Apply pagination
    const offset = (page - 1) * pageLimit;
    const products = filteredProducts.slice(offset, offset + pageLimit);
    
    return { products, totalPages, totalProducts };
}

export async function getAllProducts(db: Firestore): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    const productList = productSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as Product));
    return productList;
}

export async function getProductById(db: Firestore, id: string): Promise<Product | undefined> {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product;
  } else {
    return undefined;
  }
}

export function addProduct(db: Firestore, product: Omit<Product, 'id'>) {
    const productsCollection = collection(db, 'products');
    addDoc(productsCollection, product)
        .catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                    path: productsCollection.path,
                    operation: 'create',
                    requestResourceData: product,
                })
            );
        });
}

export function updateProduct(db: Firestore, id: string, product: Partial<Omit<Product, 'id'>>, options?: SetOptions) {
    const docRef = doc(db, 'products', id);
    const operation = options && 'merge' in options ? 'update' : 'create';
    setDoc(docRef, product, { merge: true })
        .catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                    path: docRef.path,
                    operation: operation,
                    requestResourceData: product,
                })
            );
        });
}

export function deleteProduct(db: Firestore, id:string) {
    const docRef = doc(db, 'products', id);
    deleteDoc(docRef)
    .catch(error => {
        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            })
        );
    });
}
