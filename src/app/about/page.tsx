
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container py-12">
      <PageHeader
        title="About Sportscar Hub"
        description="Your premier destination for the finest selection of high-performance vehicles."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
             <Image
                src="http://ferrari-cdn.thron.com/static/458Speciale-1280x0_2HS16E.jpg"
                alt="About Sportscar Hub"
                width={800}
                height={600}
                className="rounded-lg object-cover w-full"
                data-ai-hint="ferrari sportscar"
                />
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold">Our Mission</h3>
            <p className="mt-2 text-muted-foreground">
              At Sportscar Hub, our mission is to connect discerning enthusiasts with the world's most exceptional automobiles. We are driven by a passion for performance, a commitment to quality, and a dedication to providing an unparalleled customer experience.
            </p>
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
             <CardTitle>Why Choose Us?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Curated Selection</h4>
              <p className="text-muted-foreground text-sm">Every vehicle in our inventory is hand-picked and rigorously inspected to meet our high standards of quality and performance.</p>
            </div>
             <div>
              <h4 className="font-semibold">Expert Team</h4>
              <p className="text-muted-foreground text-sm">Our team of automotive experts is here to guide you, offering deep knowledge and personalized advice to help you find your perfect match.</p>
            </div>
             <div>
              <h4 className="font-semibold">Seamless Experience</h4>
              <p className="text-muted-foreground text-sm">From browsing to purchase, we provide a seamless, transparent, and enjoyable journey for every client.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
