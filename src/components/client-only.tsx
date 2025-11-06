'use client';

import { useState, useEffect, type ReactNode } from 'react';

/**
 * A component that only renders its children on the client-side after mounting.
 * This is used to prevent hydration mismatches for components that behave
 * differently on the server vs. the client (e.g., relying on window or localStorage).
 */
export function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
