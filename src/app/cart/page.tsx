
'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, doc, deleteDoc } from 'firebase/firestore';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type CartItem = {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    imageUrl: string;
    quantity: number;
};

export default function CartPage() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();

    const cartItemsCollection = useMemoFirebase(
        () => (user ? collection(firestore, `users/${user.uid}/cartItems`) : null),
        [firestore, user]
    );
    const { data: cartItems, isLoading } = useCollection<CartItem>(cartItemsCollection);

    const handleDeleteItem = (itemId: string) => {
        if (!user || !firestore) return;
        const itemRef = doc(firestore, `users/${user.uid}/cartItems`, itemId);
        deleteDocumentNonBlocking(itemRef);
        toast({
            title: 'Item Removed',
            description: 'The item has been removed from your cart.',
        });
    };

    const cartTotal = useMemo(() => {
        return cartItems?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
    }, [cartItems]);

    if (isUserLoading || isLoading) {
        return (
            <div className="container py-12">
                <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <Skeleton className="h-96 w-full" />
                    </div>
                    <div>
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </div>
        );
    }
    
    if (!user) {
        return (
             <div className="container py-24 text-center">
                <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight">Sign in to see your cart</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Log in to add items and view your shopping cart.
                </p>
                {/* We can trigger the sign-in sheet from here if we enhance the header context */}
            </div>
        )
    }

    if (cartItems?.length === 0) {
        return (
            <div className="container py-24 text-center">
                <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight">Your cart is empty</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Looks like you haven't added any amazing sportscars yet.
                </p>
                <Button asChild className="mt-6">
                    <Link href="/inventory">Explore Inventory</Link>
                </Button>
            </div>
        );
    }


    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[120px]">Product</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="w-[50px]"><span className="sr-only">Remove</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cartItems?.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Image src={item.imageUrl} alt={`${item.make} ${item.model}`} width={100} height={75} className="rounded-md object-cover" />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <p>{item.make} {item.model}</p>
                                                <p className="text-sm text-muted-foreground">{item.year}</p>
                                            </TableCell>
                                            <TableCell className="text-right">${item.price.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Remove item</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${cartTotal.toLocaleString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
