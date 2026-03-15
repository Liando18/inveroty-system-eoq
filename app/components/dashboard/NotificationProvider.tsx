"use client";

import { useEffect, useState } from "react";
import {
  registerServiceWorker,
  requestNotificationPermission,
  subscribeToStockChanges,
} from "@/app/lib/notification";
import { showNotification } from "@/app/lib/notification";

interface NotificationProviderProps {
  children: React.ReactNode;
}

export default function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initNotifications() {
      try {
        
        await registerServiceWorker();

        
        const permission = await requestNotificationPermission();
        console.log("Notification permission:", permission);

        if (permission === "granted") {
          
          const { supabase } = await import("@/app/lib/supabase");
          const { data: allStok } = await supabase
            .from("stok")
            .select("*, produk(nama)");

          
          const lowStockItems = (allStok || []).filter(
            (item: any) => item.stok <= item.minimum,
          );

          
          const hasNotifiedLowStock = sessionStorage.getItem(
            "hasNotifiedLowStock",
          );

          if (
            lowStockItems &&
            lowStockItems.length > 0 &&
            !hasNotifiedLowStock
          ) {
            const item = lowStockItems[0] as any;
            const produkName = item.produk?.nama || "Produk";

            await showNotification({
              title: "⚠️ Stok Menipis",
              body: `${produkName} memiliki stok ${item.stok} (minimum: ${item.minimum})`,
              tag: "low-stock-initial",
            });

            sessionStorage.setItem("hasNotifiedLowStock", "true");
          }

          
          const unsubscribe = subscribeToStockChanges(async (item) => {
            const produkName = (item as any).produk?.nama || "Produk";

            await showNotification({
              title: "⚠️ Stok Menipis",
              body: `${produkName} memiliki stok ${item.stok} (minimum: ${item.minimum})`,
              tag: `low-stock-${item.id}`,
            });
          });

          
          return () => {
            unsubscribe();
          };
        }
      } catch (error) {
        console.error("Error initializing notifications:", error);
      } finally {
        setIsInitialized(true);
      }
    }

    initNotifications();
  }, []);

  return <>{children}</>;
}
