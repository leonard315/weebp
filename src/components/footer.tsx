
import Link from 'next/link';
import { Car } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClientOnly } from './client-only';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground border-t">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
            <Car className="h-6 w-6 text-primary" />
            <span>Sportscar Hub</span>
          </Link>
          <p className="text-sm">
            Your premier destination for the finest selection of high-performance vehicles.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Inventory</h4>
          <nav className="grid gap-2">
            <Link href="/inventory" className="hover:text-primary transition-colors">New Cars</Link>
            <Link href="/inventory" className="hover:text-primary transition-colors">Used Cars</Link>
            <Link href="/inventory" className="hover:text-primary transition-colors">Certified Pre-Owned</Link>
            <Link href="/inventory" className="hover:text-primary transition-colors">Coming Soon</Link>
          </nav>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Our Company</h4>
          <nav className="grid gap-2">
            <Link href="#" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
            <Link href="#" className="hover:text-primary transition-colors">Careers</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/seed-data" className="text-blue-500 hover:text-blue-700 transition-colors">Seed Data</Link>
          </nav>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Stay Connected</h4>
          <p className="text-sm mb-4">
            Sign up for our newsletter to get the latest news, updates, and special offers.
          </p>
          <ClientOnly>
            <form className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="bg-background"/>
              <Button type="submit">Subscribe</Button>
            </form>
          </ClientOnly>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col sm:flex-row justify-between items-center py-4">
          <p className="text-sm text-center">
            &copy; 2024 Sportscar Hub. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            {/* Social Icons can go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
