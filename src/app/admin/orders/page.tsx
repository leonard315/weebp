
'use client';

import { collection, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

type CarItem = {
  make: string;
  model: string;
  imageUrl: string;
}

type Order = {
  id: string;
  userEmail: string;
  orderDate: Timestamp;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  items: CarItem[];
  userId: string;
};

// This is a placeholder for an admin UID. 
// In a real application, you would manage roles using custom claims or a database lookup.
const ADMIN_UID = 'p6Y0dt2Vn7VQvUZ6DgmTzMRrvg93';

// Helper function to format the Firestore Timestamp
function formatDateTime(timestamp: Timestamp | null | undefined) {
  if (!timestamp) return 'N/A';
  return timestamp.toDate().toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminOrdersPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const isAdmin = user?.uid === ADMIN_UID;

  const ordersQuery = useMemoFirebase(
    () => {
      if (!user) return null;
      
      const ordersCollection = collection(firestore, 'orders');
      if (isAdmin) {
        // Admin can see all orders
        return query(ordersCollection, orderBy('orderDate', 'desc'));
      } else {
        // Regular user can only see their own orders
        return query(
          ordersCollection,
          where('userId', '==', user.uid),
          orderBy('orderDate', 'desc')
        );
      }
    },
    [firestore, user, isAdmin]
  );

  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);
  const pageTitle = isAdmin ? "All Customer Orders" : "My Orders";
  const pageDescription = isAdmin ? "View and manage all orders." : "View your order history.";

  if (isUserLoading) {
     return (
       <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
         <PageHeader
          title={pageTitle}
          description={pageDescription}
        />
        <Card>
           <CardHeader>
            <CardTitle>Your Orders</CardTitle>
            <CardDescription>
              Loading order history...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell w-[80px]">Image</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell">
                       <Skeleton className="h-12 w-12 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-5 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-24 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Access Denied
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Please sign in to view orders.
        </p>
         <Button asChild className="mt-6">
            <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
      />
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            A list of all placed purchases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell w-[80px]">Image</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                     <TableCell className="hidden sm:table-cell">
                       <Skeleton className="h-12 w-12 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-5 w-20 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              {orders?.map((order) => (
                <TableRow key={order.id}>
                    <TableCell className="hidden sm:table-cell">
                      {order.items && order.items.length > 0 && (
                        <Image
                          src={order.items[0].imageUrl}
                          alt={order.items[0].make}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                      )}
                    </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {order.items?.map(item => `${item.make} ${item.model}`).join(', ')}
                    </div>
                    <div className="text-sm text-muted-foreground">{order.userEmail}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDateTime(order.orderDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.totalAmount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLoading && orders?.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold">No Orders Found</h2>
              <p className="text-muted-foreground mt-2">
                There are no orders to display yet.
              </p>
               {!isAdmin && (
                 <Button asChild className="mt-4">
                  <Link href="/inventory">Start Shopping</Link>
                </Button>
               )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
