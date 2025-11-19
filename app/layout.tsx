import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wellcart Farm Portal',
  description: 'Onboarding, uploads, and eligibility management for Wellcart partners.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
