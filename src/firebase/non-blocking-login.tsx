'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  FirebaseError,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch((error: FirebaseError) => {
     toast({
      title: 'Sign-In Failed',
      description: error.message || 'An unexpected error occurred.',
      variant: 'destructive',
    });
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password).catch((error: FirebaseError) => {
     toast({
      title: 'Sign-Up Failed',
      description: error.message || 'Could not create account. Please try again.',
      variant: 'destructive',
    });
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password).catch((error: FirebaseError) => {
    let description = 'An unexpected error occurred. Please try again.';
    if (error.code === 'auth/invalid-credential') {
      description = 'Invalid credentials. Please check your email and password.';
    } else {
      description = error.message;
    }
    toast({
      title: 'Sign-In Failed',
      description: description,
      variant: 'destructive',
    });
  });
}
