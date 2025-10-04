'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isUserLoading && !user && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [user, isUserLoading, router, pathname])

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if(isUserLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return <>{children}</>
}
