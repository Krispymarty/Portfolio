import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border mt-auto py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          © {new Date().getFullYear()} Yashmit Singh. Building things.
        </p>
        <div className="flex space-x-6">
          <Link href="https://github.com/" className="text-foreground/60 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
            GitHub
          </Link>
          <Link href="https://linkedin.com/" className="text-foreground/60 hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
