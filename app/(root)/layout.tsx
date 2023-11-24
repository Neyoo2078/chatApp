import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import SideBar from '@/components/SideBar';
import ButtomBar from '@/components/ButtomBar';
import SessionProvider from '@/providers/SessionProvider';
import Store from '@/Redux/ReduxProvider';
import { SocketProvider } from '@/providers/socket-provider';

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
      <body className={inter.className}>
        <Store>
          <SessionProvider>
            {' '}
            <SocketProvider>
              <div className="flex ">
                <SideBar />
                {children}
              </div>
            </SocketProvider>
          </SessionProvider>
        </Store>
      </body>
    </html>
  );
}
