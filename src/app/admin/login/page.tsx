
'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, type User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { FirebaseError } from 'firebase/app';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // This function is called after a user is confirmed to be authenticated.
  const handleAuthSuccess = (user: User) => {
    toast({ title: 'Login successful!' });
    router.push('/admin');
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);

    try {
      // First, try to sign in.
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      handleAuthSuccess(userCredential.user);
    } catch (error) {
      // If sign-in fails...
      if (error instanceof FirebaseError && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
        // ...and the reason is that the user doesn't exist, try creating a new account.
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          toast({ title: 'New admin account created!' });
          handleAuthSuccess(userCredential.user);
        } catch (createError: any) {
          // If creating the account fails...
          toast({
            variant: 'destructive',
            title: 'Account Creation Failed',
            description: createError.message || 'An unexpected error occurred.',
          });
          setIsLoading(false);
        }
      } else {
        // Handle other sign-in errors (e.g., wrong password, network issues).
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: (error as Error).message || 'An unexpected error occurred.',
        });
        setIsLoading(false);
      }
    } 
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Login or Create Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
