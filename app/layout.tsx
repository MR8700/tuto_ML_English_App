import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Burkina Faso Rainfall-Crop Simulation',
  description: 'Interactive season simulation showing rainfall impact on crop growth and AI-based yield prediction.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
