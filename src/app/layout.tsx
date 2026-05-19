import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skittex CRM | Admin Dashboard",
  description: "Premium Agency Management Ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body style={{
        margin: 0,
        padding: 0,
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#f0f0ff',
        fontFamily: '"Inter", sans-serif',
        WebkitFontSmoothing: 'antialiased',
        overflowX: 'hidden',
      }}>
        {/* Ambient background glow */}
        <div style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: `
            radial-gradient(ellipse 600px 400px at 15% 50%, rgba(99, 102, 241, 0.08), transparent),
            radial-gradient(ellipse 500px 300px at 85% 30%, rgba(139, 92, 246, 0.06), transparent),
            radial-gradient(ellipse 400px 300px at 50% 90%, rgba(236, 72, 153, 0.04), transparent)
          `,
        }} />
        {children}
      </body>
    </html>
  );
}

