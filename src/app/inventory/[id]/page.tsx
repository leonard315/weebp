
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { sampleCars } from '@/lib/sample-cars';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Car, Clock, Gauge, GitCommitHorizontal, Palette, Wrench } from 'lucide-react';

type CarType = {
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


export default function CarDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const car = sampleCars.find((c) => c.id === id);

  if (!car) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold">Car Not Found</h1>
        <p className="mt-2 text-muted-foreground">The car you are looking for does not exist.</p>
        <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
      </div>
    );
  }

  const handleAddToCart = (car: CarType) => {
    if (isUserLoading) return;
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart.',
      });
      return;
    }

    if (!firestore) return;

    const cartItemId = uuidv4();
    const cartItemData = {
        id: cartItemId,
        carId: car.id,
        quantity: 1,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        imageUrl: car.imageUrl,
    };
    
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

  const carDetails = [
      { icon: Clock, label: 'Year', value: car.year },
      { icon: Gauge, label: 'Mileage', value: `${car.mileage.toLocaleString()} miles` },
      { icon: Palette, label: 'Color', value: car.color },
      { icon: Wrench, label: 'Engine', value: car.engine },
      { icon: Car, label: 'Horsepower', value: `${car.horsepower} hp` },
      { icon: GitCommitHorizontal, label: 'Transmission', value: car.transmission },
  ]

  return (
    <div className="container py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <Image
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            width={1200}
            height={800}
            className="rounded-lg object-cover w-full shadow-2xl"
          />
        </div>
        <div className="space-y-6">
            <div>
                <p className="text-lg font-medium text-primary">{car.year}</p>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{car.make} {car.model}</h1>
                <p className="mt-4 text-4xl font-bold">${car.price.toLocaleString()}</p>
            </div>
          
          <Separator />

          <p className="text-muted-foreground text-lg leading-relaxed">
            {car.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-lg">
             {carDetails.map(detail => (
                 <div key={detail.label} className="flex items-center gap-3">
                     <detail.icon className="h-7 w-7 text-primary" />
                     <div>
                         <p className="text-sm text-muted-foreground">{detail.label}</p>
                         <p className="font-semibold">{detail.value}</p>
                     </div>
                 </div>
             ))}
          </div>

           <Separator />
          
          <div className="pt-4">
             <Button onClick={() => handleAddToCart(car)} size="lg" className="w-full text-lg">
                Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
