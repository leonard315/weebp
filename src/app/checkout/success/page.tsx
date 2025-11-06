
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useFirestore, useDoc } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { doc, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Order = {
    id: string;
    totalAmount: number;
    orderDate: Timestamp;
    items: any[];
};

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const firestore = useFirestore();

    const orderRef = useMemoFirebase(
        () => (orderId ? doc(firestore, 'orders', orderId) : null),
        [firestore, orderId]
    );

    const { data: order, isLoading } = useDoc<Order>(orderRef);

    if (isLoading) {
        return (
             <div className="container py-24 text-center">
                <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                <Skeleton className="h-9 w-3/4 mx-auto mt-6" />
                <Skeleton className="h-5 w-1/2 mx-auto mt-4" />
                <Skeleton className="h-10 w-40 mx-auto mt-8" />
             </div>
        )
    }

    if (!order) {
        return (
             <div className="container py-24 text-center">
                <h1 className="text-3xl font-bold">Order Not Found</h1>
                <p className="mt-2 text-muted-foreground">We couldn&apos;t find the details for this order.</p>
                <Button asChild className="mt-6">
                    <Link href="/inventory">Continue Shopping</Link>
                </Button>
            </div>
        );
    }
    
    return (
        <div className="bg-background">
            <div className="container py-24">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader className="text-center">
                        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                        <CardTitle className="mt-4 text-3xl">Thank You for Your Order!</CardTitle>
                        <CardDescription className="mt-2 text-lg">
                           Your order <span className="font-semibold text-primary">#{order.id.substring(0, 8)}</span> has been placed.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">We&apos;ve sent a confirmation to your email. You can view your order details in your account.</p>
                        <div className="mt-8 flex justify-center gap-4">
                             <Button asChild>
                                <Link href="/inventory">Continue Shopping</Link>
                            </Button>
                             <Button asChild variant="outline">
                                <Link href="/admin/orders">View My Orders</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

