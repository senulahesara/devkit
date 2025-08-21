"use client";

import { useEffect, useState } from "react";

export default function PWAInstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            // Save event so it can be triggered later
            setDeferredPrompt(e as any);
            setIsInstallable(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt(); // Show install prompt

        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install: ${outcome}`);
        setDeferredPrompt(null); // Reset after use
    };

    return (
        isInstallable && (
            <button
                onClick={handleInstallClick}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
                Install DevDeck
            </button>
        )
    );
}
