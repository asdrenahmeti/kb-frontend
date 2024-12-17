"use client";

import Navbar from "@/components/ui/navigation";
import Footer from "@/components/ui/footer";
import Newsletter from "@/components/ui/newsletter";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
      {!isDashboard && <Newsletter />}
      {!isDashboard && <Footer />}
    </>
  );
}
