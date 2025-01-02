// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ToastProvider } from "@/app/components/ToastContext";
import { GeometricBackground } from "@/app/components/GeometricBackground";
import { viewport } from "@/app/metadata";

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
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </head>
      <body
        className={`${inter.className} flex flex-col h-full overflow-x-hidden`}
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
        suppressHydrationWarning
      >
        <GeometricBackground />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
