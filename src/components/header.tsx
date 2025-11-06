
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Car, Shield, LogOut, ShoppingCart, CircleUser } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser, useCollection, useFirestore } from '@/firebase';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
} from '@/firebase/non-blocking-login';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useMemoFirebase } from '@/firebase/provider';
import { collection } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { ClientOnly } from './client-only';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInSheetOpen, setIsSignInSheetOpen] = useState(false);
  const [isSignUpSheetOpen, setIsSignUpSheetOpen] = useState(false);
  const auth = useAuth();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const prevUserRef = useRef<User | null>(null);

  useEffect(() => {
    const wasJustLoggedIn = !prevUserRef.current && user;
    if (wasJustLoggedIn) {
      toast({
        title: 'Welcome back to Sportscar Hub!',
        description: 'You have successfully logged in.',
      });
    }
    prevUserRef.current = user;
  }, [user, toast]);


  const cartItemsCollection = useMemoFirebase(
    () => (user ? collection(firestore, `users/${user.uid}/cartItems`) : null),
    [firestore, user]
  );
  const { data: cartItems } = useCollection(cartItemsCollection);
  const cartItemCount = cartItems?.length || 0;

  const handleSignIn = () => {
    if (!email || !password) {
      toast({
        title: 'Missing Information',
        description: 'Email and password cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    initiateEmailSignIn(auth, email, password);
    setIsSignInSheetOpen(false);
    setEmail('');
    setPassword('');
  };

  const handleSignUp = () => {
    if (!email || !password) {
       toast({
        title: 'Missing Information',
        description: 'Email and password cannot be empty for sign-up.',
        variant: 'destructive',
      });
      return;
    }
    initiateEmailSignUp(auth, email, password);
    setIsSignUpSheetOpen(false);
    setEmail('');
    setPassword('');
    toast({
        title: 'Account Created Successfully!',
        description: 'Please sign in with your new credentials.',
    });
    // Open the sign-in sheet after successful sign-up
    setIsSignInSheetOpen(true);
  };

  const handleSignOut = () => {
    signOut(auth);
    toast({
        title: 'Signed Out',
        description: 'You have been successfully logged out.',
    })
  };

  const openSignUpSheet = () => {
    setIsSignInSheetOpen(false);
    setIsSignUpSheetOpen(true);
  };

  const openSignInSheet = () => {
    setIsSignUpSheetOpen(false);
    setIsSignInSheetOpen(true);
  };

  const navLinks = [
    { href: '/inventory', label: 'Inventory' },
    { href: '/admin/orders', label: 'My Orders', requiresAuth: true },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Car className="h-6 w-6 text-primary" />
            <span className="hidden md:inline">Sportscar Hub</span>
            <span className="sr-only md:hidden">Sportscar Hub</span>
          </Link>

          {/* Nav and Auth section now wrapped in ClientOnly */}
          <ClientOnly>
            <div className="flex items-center gap-6">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                {navLinks.map((link) => (
                  (!link.requiresAuth || user) && (
                    <Link
                      key={`${link.href}-${link.label}`}
                      href={link.href}
                      className="transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </nav>

              {/* Auth buttons and Mobile Menu Trigger */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/cart" aria-label="Shopping Cart">
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {cartItemCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0 text-xs">
                          {cartItemCount}
                        </Badge>
                      )}
                    </div>
                  </Link>
                </Button>
                {user ? (
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                       <DropdownMenuItem asChild>
                          <Link href="/admin/orders">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            My Orders
                          </Link>
                       </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className='hidden md:flex items-center gap-4'>
                    <Sheet
                      open={isSignInSheetOpen}
                      onOpenChange={setIsSignInSheetOpen}
                    >
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right">
                        <SheetHeader>
                          <SheetTitle>Sign In</SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              className="col-span-3"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="password"
                              className="text-right"
                            >
                              Password
                            </Label>
                            <Input
                              id="password"
                              type="password"
                              className="col-span-3"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" onClick={handleSignIn}>
                            Sign In
                          </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                          Don&apos;t have an account?{' '}
                          <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={openSignUpSheet}
                          >
                            Sign up
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>

                    {/* Sign Up Sheet */}
                    <Sheet
                      open={isSignUpSheetOpen}
                      onOpenChange={setIsSignUpSheetOpen}
                    >
                      {/* We don't render a trigger, it's opened from the sign in sheet */}
                      <SheetContent side="right">
                        <SheetHeader>
                          <SheetTitle>Create Account</SheetTitle>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="signup-email"
                              className="text-right"
                            >
                              Email
                            </Label>
                            <Input
                              id="signup-email"
                              type="email"
                              placeholder="you@example.com"
                              className="col-span-3"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="signup-password"
                              className="text-right"
                            >
                              Password
                            </Label>
                            <Input
                              id="signup-password"
                              type="password"
                              className="col-span-3"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button type="submit" onClick={handleSignUp}>
                            Sign Up
                          </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                          Already have an account?{' '}
                          <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={openSignInSheet}
                          >
                            Sign In
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                )}

                {/* Mobile Menu */}
                <div className="md:hidden">
                  <Sheet
                    open={isMobileMenuOpen}
                    onOpenChange={setIsMobileMenuOpen}
                  >
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-auto">
                      <div className="grid gap-6 p-6">
                        <Link
                          href="/"
                          className="flex items-center gap-2 font-bold text-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Car className="h-6 w-6 text-primary" />
                          <span>Sportscar Hub</span>
                        </Link>
                        <nav className="grid gap-4">
                          {navLinks.map((link) => (
                            (!link.requiresAuth || user) && (
                              <Link
                                key={`${link.href}-${link.label}-mobile`}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-medium transition-colors hover:text-primary"
                              >
                                {link.label}
                              </Link>
                            )
                          ))}
                        </nav>
                        {user ? (
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="ghost"
                              asChild
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Link href="/admin/orders">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                My Orders
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                handleSignOut();
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <LogOut className="mr-2 h-4 w-4" />
                              Sign Out
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                openSignInSheet();
                              }}
                            >
                              Sign In
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                openSignUpSheet();
                              }}
                            >
                              Sign Up
                            </Button>
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </ClientOnly>
        </div>
      </header>
    </>
  );
}

    