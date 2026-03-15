"use client";

import { useEffect, useState, useRef } from "react";

export default function PWAInstallPrompt() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const deferredPromptRef = useRef<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari =
      /safari/.test(userAgent) && !/chrome|crios|crmo/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOSDevice && isSafari) {
      setIsIOS(true);
      const timer = setTimeout(() => setShowIOSPrompt(true), 2500);
      return () => clearTimeout(timer);
    }

    if (isAndroid || (!isIOSDevice && !isSafari)) {
      const timer = setTimeout(() => setIsInstallable(true), 2500);

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        deferredPromptRef.current = e;
        setIsInstallable(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        clearTimeout(timer);
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt,
        );
      };
    }
  }, []);

  useEffect(() => {
    const handleManualInstall = async () => {
      
      if (isIOS) {
        setShowIOSPrompt(true);
      } else if (deferredPromptRef.current) {
        deferredPromptRef.current.prompt();
        const { outcome } = await deferredPromptRef.current.userChoice;
        if (outcome === "accepted") {
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
        deferredPromptRef.current = null;
      } else {
        alert(
          "Untuk menginstall, silakan buka menu browser (titik tiga) lalu pilih 'Tambah ke Layar Utama' atau 'Add to Home Screen'.",
        );
      }
    };

    window.addEventListener("trigger-pwa-install", handleManualInstall);
    return () => {
      window.removeEventListener("trigger-pwa-install", handleManualInstall);
    };
  }, [isIOS]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
      deferredPromptRef.current = null;
    } else {
      alert(
        "Untuk menginstall, silakan buka menu browser (titik tiga) lalu pilih 'Tambah ke Layar Utama' atau 'Add to Home Screen'.",
      );
    }
  };

  const handleClose = () => {
    setIsInstallable(false);
    setShowIOSPrompt(false);
  };

  if (!isInstallable && !showIOSPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 flex justify-center animate-in slide-in-from-bottom-5">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-green-100 p-4 max-w-md w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Install 4YosApp</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isIOS
                ? "Akses lebih cepat & mudah dari Home Screen!"
                : "Install aplikasi untuk pengalaman terbaik"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="shrink-0 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-200">
              Install
            </button>
          )}

          <button
            onClick={handleClose}
            className="shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Tutup">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {isIOS && showIOSPrompt && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl w-64 text-center">
          <p>
            Tap{" "}
            <span className="inline-block px-1 bg-gray-800 rounded">Share</span>{" "}
            dibawah lalu pilih{" "}
            <span className="font-semibold text-green-400">
              Add to Home Screen
            </span>
          </p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
