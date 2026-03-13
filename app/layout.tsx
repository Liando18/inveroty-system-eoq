import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./services/ServiceWorkerRegister";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "4Yos Veterinary Care",
  description: "Sistem Manajemen Persediaan PWA dengan EOQ dan ROP",
  manifest: "/manifest.webmanifest",
  themeColor: "#11df86",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${poppins.className} antialiased`}>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
