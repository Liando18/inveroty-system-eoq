"use client";

import { useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import Navbar from "@/app/components/home/Navbar";
import HeroSection from "@/app/components/home/HeroSection";
import ServicesSection from "@/app/components/home/ServicesSection";
import InfoSection from "@/app/components/home/InfoSection";
import LocationSection from "@/app/components/home/LocationSection";
import Footer from "@/app/components/home/Footer";

export default function HomePage() {
  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from("produk").select("*");
      console.log("DATA:", data);
      console.log("ERROR:", error);
    };

    testConnection();
  }, []);

  return (
    <div className="text-gray-900 bg-white">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <InfoSection />
      <LocationSection />
      <Footer />
    </div>
  );
}
