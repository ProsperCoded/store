import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers"; // Import the Providers component
import { ToasterProvider } from "./components/Toaster";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-200 text-neutral-700">
        <Providers>
          {" "}
          {/* Wrap children with SessionProvider in Providers.tsx */}
          {children}
          <ToasterProvider />
        </Providers>
      </body>
    </html>
  );
}
