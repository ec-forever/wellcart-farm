import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-white text-[#0F3D1C] antialiased`}>
        <div className="min-h-screen">
          <div className="mx-auto max-w-6xl px-6 py-12 lg:px-10 lg:py-16">{children}</div>
        </div>
      </body>
    </html>
  );
}
