

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addProduct, updateProduct, type Product, type ProductCategory } from '@/lib/products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Loader } from 'lucide-react';
import { useFirebase } from '@/firebase';


const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  price: z.coerce.number().positive({
    message: 'Price must be a positive number.',
  }),
  category: z.enum(['Home Accessories', 'Kitchen', 'Beauty']),
  imageUrls: z.string().min(1, { message: 'At least one image URL is required.'}),
  imageHints: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  productToEdit?: Product;
  onFormSubmit?: () => void;
}

const categories: ProductCategory[] = ['Home Accessories', 'Kitchen', 'Beauty'];

export function ProductForm({ productToEdit, onFormSubmit }: ProductFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { firestore } = useFirebase();


  const defaultValues = productToEdit
    ? { 
        ...productToEdit,
        imageUrls: productToEdit.imageUrls.join(', '),
      }
    : {
        name: '',
        description: '',
        price: 0,
        category: 'Home Accessories' as ProductCategory,
        imageUrls: '',
        imageHints: [],
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true);

    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Firebase not initialized',
        description: 'The Firebase services are not available. Please try again later.',
      });
      setIsLoading(false);
      return;
    }
    
    // The non-blocking functions in lib/products.ts will handle their own errors
    // by emitting them globally. We don't need a top-level try/catch here.

    const imageUrlArray = data.imageUrls.split(',').map(url => url.trim()).filter(url => url);

    if (imageUrlArray.length === 0) {
      form.setError('imageUrls', { message: 'Please enter at least one valid URL.' });
      setIsLoading(false);
      return;
    }
    
    const finalProductData = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrls: imageUrlArray,
      imageHints: data.imageHints || [],
    };

    if (productToEdit) {
      updateProduct(firestore, productToEdit.id, finalProductData);
      toast({
        title: 'Product update initiated',
        description: `${data.name} is being updated.`,
      });
    } else {
      addProduct(firestore, finalProductData);
      toast({
        title: 'Product creation initiated',
        description: `${data.name} is being created.`,
      });
      form.reset({
          name: '',
          description: '',
          price: 0,
          category: 'Home Accessories',
          imageUrls: '',
          imageHints: [],
      });
    }
    
    onFormSubmit?.();
    setIsLoading(false);
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Minimalist Vase" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A beautifully crafted minimalist vase..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" placeholder="29.99" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <FormField
          control={form.control}
          name="imageUrls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URLs</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="https://.../image1.jpg, https://.../image2.png"
                  className="resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Paste image URLs separated by commas. The first URL will be the main image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          {productToEdit ? 'Save Changes' : 'Create Product'}
        </Button>
      </form>
    </Form>
  );
}
