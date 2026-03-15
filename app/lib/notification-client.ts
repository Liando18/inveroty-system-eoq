"use client";

import { supabase } from "@/app/lib/supabase";
import {
  showNotification,
  subscribeToStockChanges,
} from "@/app/lib/notification";

export interface StokWithProduk {
  id: number;
  produk_id: number;
  stok: number;
  minimum: number;
  produk?: {
    nama: string;
  };
}


export async function checkLowStockAndNotify(): Promise<void> {
  try {
    
    const { data: allStok, error } = await supabase
      .from("stok")
      .select("*, produk(nama)");

    if (error) {
      console.error("Error fetching stock:", error);
      return;
    }

    
    const lowStockItems = (allStok || []).filter(
      (item: any) => item.stok <= item.minimum,
    );

    if (lowStockItems && lowStockItems.length > 0) {
      
      const itemsToNotify = lowStockItems.slice(0, 3);

      for (const item of itemsToNotify) {
        const produkName = (item as any).produk?.nama || "Produk";

        await showNotification({
          title: "⚠️ Stok Menipis",
          body: `${produkName} memiliki stok ${item.stok} (minimum: ${item.minimum})`,
          tag: `low-stock-${item.id}`,
          data: {
            type: "low-stock",
            itemId: item.id,
            produkId: item.produk_id,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error in checkLowStockAndNotify:", error);
  }
}


export async function checkProductLowStock(
  produkId: number,
): Promise<StokWithProduk | null> {
  try {
    const { data, error } = await supabase
      .from("stok")
      .select("*, produk(nama)")
      .eq("produk_id", produkId)
      .single();

    if (error || !data) return null;

    const stokData = data as unknown as StokWithProduk;

    
    if (stokData.stok <= stokData.minimum) {
      const produkName = stokData.produk?.nama || "Produk";

      await showNotification({
        title: "⚠️ Stok Menipis",
        body: `${produkName} memiliki stok ${stokData.stok} (minimum: ${stokData.minimum})`,
        tag: `low-stock-${stokData.id}`,
        data: { type: "low-stock", itemId: stokData.id, produkId },
      });
    }

    return stokData;
  } catch (error) {
    console.error("Error checking product stock:", error);
    return null;
  }
}


export function subscribeToLowStockNotifications(
  onLowStock: (item: StokWithProduk) => void,
): () => void {
  return subscribeToStockChanges(onLowStock);
}
