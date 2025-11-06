
'use client'

import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin-sidebar";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";


// export const metadata: Metadata = {
//     title: "Admin Dashboard - Sportscar Hub",
//     description: "Manage your sportscar inventory.",
// };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <p className="text-lg">Loading Admin Dashboard...</p>
            </div>
        </div>
    );
  }

  if (!user) {
     return (
      <div className="container py-24 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Access Denied
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          You must be signed in to view this page.
        </p>
         <Button asChild className="mt-6">
            <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
        </main>
      </div>
    </div>
  );
}

    