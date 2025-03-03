import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import { Toaster } from 'react-hot-toast';
import Providers from '@/components/Providers';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Student Senior Dashboard',
    description: 'Your Companion Dashboard',
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 3000,
                        }}
                    />

                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
