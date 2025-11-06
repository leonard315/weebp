'use client';

import { useMemo } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection } from '@/firebase';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useMemoFirebase } from '@/firebase/provider';
import { PageHeader } from '@/components/page-header';

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
};

export default function AdminCarsPage() {
  const firestore = useFirestore();
  const carsCollection = useMemoFirebase(() => collection(firestore, 'cars'), [firestore]);
  const { data: cars, isLoading } = useCollection<Car>(carsCollection);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
         <PageHeader title="Cars" />
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Car
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>
            Manage your car inventory and view their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Mileage
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell">
                      <div className="h-16 w-16 bg-muted rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="h-6 w-32 bg-muted rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-6 w-16 bg-muted rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="h-6 w-24 bg-muted rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                       <div className="h-6 w-24 bg-muted rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-8 bg-muted rounded-md animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))}
              {cars?.map((car) => (
                <TableRow key={car.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={`${car.make} ${car.model}`}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={car.imageUrl}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {car.make} {car.model}
                  </TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    ${car.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {car.mileage.toLocaleString()} miles
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           { !isLoading && cars?.length === 0 && (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold">No Cars Found</h2>
                    <p className="text-muted-foreground mt-2">Add your first car to the inventory to get started.</p>
                     <Button className="mt-4">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Car
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
