import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catatu EV Booking',
  description: 'Ride Green, Save the Planet'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
