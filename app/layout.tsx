import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/ui/themes';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ghost AI',
  description: 'Real-time collaborative system design workspace powered by AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-base text-copy-primary antialiased">
        <ClerkProvider
          appearance={{
            theme: dark,
            variables: {
              colorBackground: 'var(--bg-surface)',
              colorInput: 'var(--bg-elevated)',
              colorInputForeground: 'var(--text-primary)',
              colorForeground: 'var(--text-primary)',
              colorMutedForeground: 'var(--text-secondary)',
              colorPrimary: 'var(--accent-primary)',
              colorNeutral: 'var(--text-muted)',
              colorDanger: 'var(--state-error)',
              fontFamily: 'inherit',
              borderRadius: '0.75rem',
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
