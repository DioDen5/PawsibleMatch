import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t bg-secondary/50">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {currentYear}{' '}
          <Link
            href="/"
            className="font-medium underline underline-offset-4"
          >
            PawsibleMatch
          </Link>
          . All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline hover:text-foreground"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
