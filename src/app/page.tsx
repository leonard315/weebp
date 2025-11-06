
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { placeholderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientOnly } from '@/components/client-only';

export default function Home() {
  return (
    <>
      <section className="relative w-full h-[80vh] min-h-[400px] flex items-center justify-center text-center text-white">
        <Image
          alt="Hero Sportscar"
          src="https://picsum.photos/seed/hero/1920/1080"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-[-1] brightness-50"
          data-ai-hint="sportscar driving sunset"
        />
        <div className="relative container px-4 md:px-6">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Find Your Next High-Performance Ride
            </h1>
            <p className="md:text-xl text-lg opacity-90">
              The premier destination for new and pre-owned luxury sportscars.
            </p>
            <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-2xl max-w-2xl mx-auto">
              <ClientOnly>
                <form className="grid sm:grid-cols-3 gap-4">
                  <Select>
                    <SelectTrigger aria-label="Make">
                      <SelectValue placeholder="Select Make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="porsche">Porsche</SelectItem>
                      <SelectItem value="ferrari">Ferrari</SelectItem>
                      <SelectItem value="lamborghini">Lamborghini</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger aria-label="Model">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="911">911</SelectItem>
                      <SelectItem value="f8">F8 Tributo</SelectItem>
                      <SelectItem value="huracan">Huracan</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit" size="lg" className="w-full">Search</Button>
                </form>
              </ClientOnly>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-medium">
                Featured Models
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Engineered for Thrills
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our curated selection of high-performance sportscars, where cutting-edge technology meets pure driving pleasure.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-12">
            {placeholderImages.map((img) => (
              <Card key={img.id} className="group overflow-hidden">
                <CardHeader className="p-0">
                  <Image
                    src={img.imageUrl}
                    alt={img.description}
                    width="400"
                    height="250"
                    className="rounded-t-lg object-cover w-full aspect-video transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={img.imageHint}
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2">{img.description}</CardTitle>
                  <p className="text-muted-foreground mb-4">
                    Experience the pinnacle of automotive engineering and design.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="#">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/inventory">View All Inventory</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Value Your Trade-In
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get a competitive offer for your current vehicle. It's fast, easy, and you can apply the value toward your new sportscar.
              </p>
              <ClientOnly>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input placeholder="Enter VIN or License Plate" className="max-w-xs"/>
                  <Button>Get My Offer</Button>
                </div>
              </ClientOnly>
            </div>
            <Image
              alt="Trade-in"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
              height="340"
              src="https://picsum.photos/seed/tradein/550/340"
              width="550"
              data-ai-hint="car keys on table"
            />
          </div>
        </div>
      </section>
    </>
  );
}
