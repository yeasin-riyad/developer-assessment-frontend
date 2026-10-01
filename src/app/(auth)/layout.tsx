import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Branding Section */}
        <section className="hidden bg-muted lg:flex lg:flex-col lg:justify-between lg:p-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              DevAssess
            </h1>
          </div>

          <div className="max-w-md">
            <blockquote className="space-y-4">
              <p className="text-2xl font-medium leading-relaxed">
                “Build assessments, evaluate developers, and make
                data-driven hiring decisions.”
              </p>

              <footer className="text-sm text-muted-foreground">
                Developer Assessment Platform
              </footer>
            </blockquote>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DevAssess. All rights reserved.
          </p>
        </section>

        {/* Auth Form */}
        <section className="flex min-h-screen items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}