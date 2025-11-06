
'use client';

import { useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { sampleCars } from '@/lib/sample-cars';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function SeedDataPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSeedData = async () => {
    if (!firestore) {
      toast({
        title: 'Error',
        description: 'Firestore is not available.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const batch = writeBatch(firestore);
      const carsCollection = collection(firestore, 'cars');

      sampleCars.forEach((car) => {
        const docRef = doc(carsCollection, car.id);
        batch.set(docRef, car);
      });

      await batch.commit();

      toast({
        title: 'Success!',
        description: 'Sample car data has been added to your inventory.',
      });
      setIsSuccess(true);
    } catch (error: any) {
      console.error('Error seeding data:', error);
      toast({
        title: 'Seeding Failed',
        description: error.message || 'There was a problem adding the sample data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Seed Database</CardTitle>
            <CardDescription>
              Populate your Firestore database with sample car data. This will add 6 cars to your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
            {isSuccess ? (
              <div className="space-y-4">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                <p className="text-lg font-medium">Data seeded successfully!</p>
                 <Button asChild>
                  <Link href="/inventory">View Inventory</Link>
                </Button>
              </div>
            ) : (
                <>
                    <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
                    <p>Click the button below to add sample cars to your database. This will overwrite any existing cars with the same IDs.</p>
                    <Button onClick={handleSeedData} disabled={isLoading}>
                        {isLoading ? 'Seeding...' : 'Seed Sample Cars'}
                    </Button>
                </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
