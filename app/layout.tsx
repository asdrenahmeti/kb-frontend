import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import QueryClientContextProvider from "./queryClientContextProvider";
import Navbar from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import Newsletter from "@/components/ui/newsletter";
import { usePathname } from "next/navigation";
import ClientLayout from "./clientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Karaokebox Booking System",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body>
        <ClientLayout>
          <QueryClientContextProvider>{children}</QueryClientContextProvider>
        </ClientLayout>
        <Toaster richColors />
      </body>
    </html>
  );
}
