"use client";

import { supabase } from "@/app/lib/supabase";

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: Record<string, unknown>;
}


export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    console.log("Service Worker not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/push-sw.js", {
      scope: "/",
    });

    console.log("Service Worker registered:", registration);

    
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            
            newWorker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    return null;
  }
}


export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.log("Notifications not supported");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}


export function areNotificationsAllowed(): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  return Notification.permission === "granted";
}


export async function showNotification(
  payload: NotificationPayload,
): Promise<boolean> {
  console.log("showNotification called:", payload);

  if (typeof window === "undefined" || !("Notification" in window)) {
    console.log("Notifications not supported in this environment");
    return false;
  }

  if (Notification.permission !== "granted") {
    console.log(
      "Notification permission not granted:",
      Notification.permission,
    );
    return false;
  }

  try {
    
    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || "/icon.png",
      badge: "/icon.png",
      tag: payload.tag || "inventory-notification",
      data: payload.data,
      vibrate: [200, 100, 200],
    });

    notification.onclick = () => {
      console.log("Notification clicked");
      window.focus();
      notification.close();
    };

    console.log("Notification created successfully");
    return true;
  } catch (error) {
    console.error("Error showing notification:", error);
    return false;
  }
}


export async function checkAndNotifyLowStock(): Promise<void> {
  try {
    const { data: allStok, error } = await supabase
      .from("stok")
      .select("*, produk(nama)");

    if (error) {
      console.error("Error checking low stock:", error);
      return;
    }

    
    const lowStockItems = (allStok || []).filter(
      (item: any) => item.stok <= item.minimum,
    );

    if (lowStockItems && lowStockItems.length > 0) {
      const item = lowStockItems[0]; 
      const produkName = (item as any).produk?.nama || "Produk";

      await showNotification({
        title: "⚠️ Stok Menipis",
        body: `${produkName} memiliki stok ${item.stok} (minimum: ${item.minimum})`,
        tag: "low-stock-alert",
        data: { type: "low-stock", itemId: item.id },
      });
    }
  } catch (error) {
    console.error("Error in checkAndNotifyLowStock:", error);
  }
}


export function subscribeToStockChanges(
  onLowStock: (item: any) => void,
): () => void {
  const channel = supabase
    .channel("stock-changes")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "stok",
      },
      async (payload) => {
        const newStok = payload.new as any;
        
        if (newStok.stok <= newStok.minimum) {
          
          const { data: produk } = await supabase
            .from("produk")
            .select("nama")
            .eq("id", newStok.produk_id)
            .single();

          const produkName = produk?.nama || "Produk";

          const item = {
            ...newStok,
            produk: { nama: produkName },
          };

          onLowStock(item);
        }
      },
    )
    .subscribe();

  
  return () => {
    supabase.removeChannel(channel);
  };
}
