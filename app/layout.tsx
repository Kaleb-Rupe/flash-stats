import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
// import HeaderWrapper from "@/app/components/HeaderWrapper";
import { ToastProvider } from "@/app/components/ToastContext";
import Sidebar from "@/app/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "flash tracker",
  description: "Analytics dashboard for Flash Trade performance tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark:bg-black dark:text-white bg-white text-black"
    >
      <body className={inter.className}>
        <ToastProvider>
          {/* Main layout wrapper */}
          <div className="min-h-screen flex flex-col">
            {/* Header section */}
            {/* <HeaderWrapper /> */}

            {/* Main content area with sidebar */}
            <div className="flex-1 flex">
              {/* Sidebar - conditionally rendered based on route */}
              <Sidebar />

              {/* Main content */}
              <main className="flex-1 p-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
