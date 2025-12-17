import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata = {
  title: "Proofed - Get Proofed or stay mid",
  description: "Zero-knowledge platform for verifiable creator and business metrics. Prove your earnings, audience, and growth privately without exposing raw data.",
};

export default function RootLayout({ children }) {
  return (
    <>
    <Analytics />
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
          
        </AuthProvider>
      </body>
    </html>
    </>
  );
}
