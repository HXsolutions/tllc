import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <Image
              src="https://i.postimg.cc/wBH2NyRD/image-removebg-preview-2.png"
              alt="triplazeellc logo"
              width={180}
              height={40}
              className="object-contain"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Your source for quality, minimalist goods for a modern lifestyle.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:underline">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Policies</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/terms" className="text-sm hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm hover:underline">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} triplazeellc. All rights reserved.</p>
          <p className="mt-2">
            Powered by{' '}
            <a
              href="https://haxxcelsolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              Haxxcel Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
