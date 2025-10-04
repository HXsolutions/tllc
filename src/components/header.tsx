'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CartIcon } from './cart-icon';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="https://i.postimg.cc/wBH2NyRD/image-removebg-preview-2.png"
              alt="triplazeellc logo"
              width={180}
              height={40}
              className="object-contain"
            />
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link
              href="/shop"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
