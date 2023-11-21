import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import SessionProvider from '@/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'What App',
  description: 'Whats App By Neyoo',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <body>
          {children}
          <div id="photo-picker-element"></div>
        </body>
      </SessionProvider>
    </html>
  );
}
