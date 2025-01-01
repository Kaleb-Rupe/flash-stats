// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ToastProvider } from "@/app/components/ToastContext";
import { GeometricBackground } from "@/app/components/GeometricBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flash Stats",
  description: "Analytics dashboard for Flash Trade performance tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <GeometricBackground />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
