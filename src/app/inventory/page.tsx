
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Separator } from '@/components/ui/separator';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { sampleCars } from '@/lib/sample-cars';
import { collection } from 'firebase/firestore';

type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  color: string;
  imageUrl: string;
  description: string;
  engine: string;
  horsepower: number;
  transmission: string;
};

function CarCard({ car, onAddToCart }: { car: Car, onAddToCart: (car: Car) => void }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/inventory/${car.id}`} className='cursor-pointer'>
            <Image
            alt={`${car.make} ${car.model}`}
            className="rounded-t-lg object-cover w-full aspect-video"
            height="250"
            src={car.imageUrl}
            width="400"
            />
        </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <p className="text-sm text-muted-foreground">{car.year} &bull; {car.mileage.toLocaleString()} miles</p>
        <CardTitle className="mt-1 text-2xl">{car.make} {car.model}</CardTitle>
        <p className="text-2xl font-bold mt-4">${car.price.toLocaleString()}</p>
        
        <Separator className="my-4" />

        <div className="grid grid-cols-3 gap-4 text-sm text-center">
            <div>
                <p className="text-muted-foreground">Engine</p>
                <p className="font-semibold">{car.engine}</p>
            </div>
            <div>
                <p className="text-muted-foreground">Horsepower</p>
                <p className="font-semibold">{car.horsepower} hp</p>
            </div>
            <div>
                <p className="text-muted-foreground">Transmission</p>
                <p className="font-semibold">{car.transmission}</p>
            </div>
        </div>

      </CardContent>
      <CardFooter className="p-6 pt-0 mt-auto">
         <Button onClick={() => onAddToCart(car)} className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

export default function InventoryPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  // Use the local sampleCars data instead of fetching from Firestore
  const cars = sampleCars;
  const isLoading = false; // Data is now local, so it's never loading

  const handleAddToCart = (car: Car) => {
    if (isUserLoading) return;
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart.',
      });
      // Optionally, trigger sign-in sheet to open
      return;
    }

    if (!firestore) return;

    const cartItemId = uuidv4();
    const cartItemData = {
        id: cartItemId,
        carId: car.id,
        quantity: 1,
        // Storing car details directly in cart for easy display
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        imageUrl: car.imageUrl,
    };
    
    // Using non-blocking update
    addDocumentNonBlocking(collection(firestore, `users/${user.uid}/cartItems`), cartItemData);

    toast({
      title: 'Added to Cart',
      description: `${car.make} ${car.model} has been added to your cart.`,
      action: (
        <Button variant="outline" size="sm" onClick={() => router.push('/cart')}>
            View Cart
        </Button>
      )
    });
  };

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Our Inventory</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore our hand-picked selection of the finest sportscars.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} onAddToCart={handleAddToCart} />
        ))}
      </div>
      
    </div>
  );
}
