
'use client';

import { ProductDataTable } from "./product-data-table";
import { Button } from "@/components/ui/button";
import { addProduct } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader } from "lucide-react";
import { useFirestore } from "@/firebase";

const sampleProducts = [
    // Home Accessories
    { name: "Ceramic Mug", description: "A minimalist ceramic mug, perfect for your morning coffee.", price: 25, category: "Home Accessories", imageUrls: ["https://images.unsplash.com/photo-1495100497150-fe209c585f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjZXJhbWljJTIwbXVnfGVufDB8fHx8MTc1OTM3OTEwOXww&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["ceramic mug"] },
    { name: "Linen Pillow", description: "A soft linen pillow to add a touch of comfort to your space.", price: 45, category: "Home Accessories", imageUrls: ["https://images.unsplash.com/photo-1639813806536-11895df1ff64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxsaW5lbiUyMHBpbGxvd3xlbnwwfHx8fDE3NTk0MTQ0MTN8MA&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["linen pillow"] },
    { name: "Soy Wax Candle", description: "A hand-poured soy wax candle with a calming scent.", price: 30, category: "Home Accessories", imageUrls: ["https://images.unsplash.com/photo-1620678835433-37a0ecb02a9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHx3YXglMjBjYW5kbGV8ZW58MHx8fHwxNzU5NDE0NDEyfDA&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["wax candle"] },
    { name: "Wall Clock", description: "A simple and elegant wall clock with a silent movement.", price: 60, category: "Home Accessories", imageUrls: ["https://images.unsplash.com/photo-1707348102631-5a4c0a6eed6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx3YWxsJTIwY2xvY2t8ZW58MHx8fHwxNzU5MzMwMDA1fDA&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["wall clock"] },
    // Kitchen
    { name: "Wooden Cutting Board", description: "A durable and beautiful wooden cutting board.", price: 55, category: "Kitchen", imageUrls: ["https://images.unsplash.com/photo-1620216464939-2a311b586182?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBjdXR0aW5nJTIwYm9hcmR8ZW58MHx8fHwxNzYwMzU3NDUwfDA&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["wood board"] },
    { name: "Stainless Steel Bottle", description: "A sleek and reusable stainless steel water bottle.", price: 35, category: "Kitchen", imageUrls: ["https://images.unsplash.com/photo-1724660579562-b17cb1172b93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxzdGVlbCUyMGJvdHRsZXxlbnwwfHx8fDE3NTkzNDkwMjl8MA&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["steel bottle"] },
    { name: "Olive Oil Bottle", description: "Artisan olive oil in a beautifully designed bottle.", price: 28, category: "Kitchen", imageUrls: ["https://images.unsplash.com/photo-1527756898251-203e9ce0d9c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxvbGl2ZSUyMG9pbHxlbnwwfHx8fDE3NTkzNzA5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["olive oil"] },
    { name: "French Press", description: "A classic French press for a rich and flavorful coffee.", price: 50, category: "Kitchen", imageUrls: ["https://images.unsplash.com/photo-1560933968-3f82f24b2b2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxGcmVuY2glMjBwcmVzc3xlbnwwfHx8fDE3NjAzNTc1MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["french press"] },
    // Beauty
    { name: "Face Serum", description: "A hydrating and rejuvenating face serum for all skin types.", price: 65, category: "Beauty", imageUrls: ["https://images.unsplash.com/photo-1620916566398-35f1684e7225?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmYWNlJTIwc2VydW18ZW58MHx8fHwxNzYwMzU3NTM5fDA&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["face serum"] },
    { name: "Bar Soap", description: "A natural bar soap with essential oils and a gentle lather.", price: 15, category: "Beauty", imageUrls: ["https://images.unsplash.com/photo-1607006471853-25c5960411d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxiYXIlMjBzb2FwfGVufDB8fHx8fDE3NjAzNTc1NjN8MA&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["bar soap"] },
    { name: "Body Lotion", description: "A rich and moisturizing body lotion with a subtle scent.", price: 40, category: "Beauty", imageUrls: ["https://images.unsplash.com/photo-1580219153440-c8f7a637c22e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxib2R5JTIwbG90aW9ufGVufDB8fHx8fDE3NjAzNTc1ODR8MA&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["body lotion"] },
    { name: "Facial Cleanser", description: "A gentle facial cleanser that removes impurities without drying.", price: 32, category: "Beauty", imageUrls: ["https://images.unsplash.com/photo-1598533633634-6c382348b6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmYWNpYWwlMjBjbGVhbnNlcnxlbnwwfHx8fDE3NjAzNTc2MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"], imageHints: ["facial cleanser"] },
];

export default function AdminPage() {
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);
    const [seedingDone, setSeedingDone] = useState(false);
    const firestore = useFirestore();

    const handleSeed = () => {
        if (!firestore) {
             toast({
                title: "Firestore not available",
                description: "Please try again later.",
                variant: 'destructive'
            });
            return;
        }
        setIsSeeding(true);
        toast({
            title: "Seeding database...",
            description: `Adding ${sampleProducts.length} sample products.`,
        });
        
        // Use non-blocking writes for seeding
        for (const product of sampleProducts) {
            addProduct(firestore, product as any);
        }

        // Since writes are non-blocking, we'll show completion toast immediately.
        // In a real app, you might want to wait for all promises to resolve.
        toast({
            title: "Database seeding initiated!",
            description: "Sample products are being added.",
        });
        setSeedingDone(true);
        setIsSeeding(false);
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Product Management</h1>
                {!seedingDone && (
                    <Button onClick={handleSeed} disabled={isSeeding}>
                        {isSeeding ? <> <Loader className="mr-2 h-4 w-4 animate-spin" /> Seeding... </> : "Seed Sample Products"}
                    </Button>
                )}
            </div>
            <ProductDataTable />
        </div>
    )
}
