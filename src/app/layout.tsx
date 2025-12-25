import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Asian Food Tours',
  description: 'Discover authentic Asian cuisine',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
