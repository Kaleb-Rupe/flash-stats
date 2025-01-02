"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isValidSolanaAddress } from "@/src/lib/utils/validators";
import { useToast } from "@/app/components/ToastContext";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function WalletInput() {
  const [address, setAddress] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  useEffect(() => {
    // Get current address from pathname
    const pathSegments = pathname.split("/");
    if (pathSegments.length === 2 && pathSegments[1]) {
      setCurrentAddress(pathSegments[1]);
    }

    if (pathname.includes("/loading")) {
      setIsLoading(false);
      return;
    }

    if (pathname === "/") {
      setAddress("");
      setIsValid(null);
      setIsLoading(false);
      setCurrentAddress("");
    }
  }, [pathname]);

  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.length > 0) {
      setIsValid(isValidSolanaAddress(value));
    } else {
      setIsValid(null);
    }
  };

  const handleSubmit = async () => {
    if (!isValid || isLoading) return;
    if (address === currentAddress) {
      showToast("This wallet is already being viewed", "info");
      return;
    }

    setIsLoading(true);
    const isOnChartsPage = pathname !== "/";
    const targetPath = isOnChartsPage ? `/${address}` : `/${address}/loading`;

    try {
      // First check if wallet exists
      const response = await fetch(
        `https://api.prod.flash.trade/trading-history/find-all-by-user-v2/${address}`
      );
      const data = await response.json();

      if (!response.ok || !data || data.length === 0) {
        throw new Error("This wallet has not been used on Flash Trade");
      }

      // If we're going to show the video, start preloading the charts data
      if (!isOnChartsPage) {
        router.prefetch(`/${address}`); // Prefetch the charts page
        // Navigate to loading page
        router.push(`/${address}/loading`);

        // Preload the data while video is playing
        fetch(
          `https://api.prod.flash.trade/trading-history/find-all-by-user-v2/${address}`
        )
          .then((res) => res.json())
          .catch((error) => {
            console.error("Failed to preload data:", error);
          });
      } else {
        // If we're already on charts, just navigate directly
        router.push(`/${address}`);
      }
    } catch (error: any) {
      showToast(error.message || "Failed to fetch wallet data", "error");
      setIsLoading(false);
    }

    // Reset loading state after timeout
    setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  };

  const handleClear = () => {
    setAddress("");
    setIsValid(null);
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto space-y-6 px-4 ${
        pathname !== "/" ? "pt-4" : ""
      }`}
    >
      {/* Centered Logo - Responsive text size with conditional sizing */}
      <h1
        className={`text-center tracking-tighter font-bold 
        ${
          pathname === "/"
            ? "text-4xl md:text-[4.5rem]"
            : "text-2xl md:text-3xl"
        }`}
      >
        ⚡ Flash Stats
      </h1>

      {/* Input Field */}
      <div className="w-full relative">
        <input
          type="text"
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isValid) {
              handleSubmit();
            }
          }}
          className={`w-full px-4 py-3 rounded-xl transition-colors focus:ring-0
            ${
              isValid === true
                ? "border-2 border-green-500 focus:border-green-600"
                : isValid === false
                ? "border-2 border-red-500 focus:border-red-600"
                : "border-2 border-zinc-800 focus:border-zinc-700"
            }
            bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none
            text-sm md:text-base
            text-ellipsis overflow-hidden whitespace-nowrap
            text-base`}
          placeholder="Enter Solana Wallet Address"
        />

        {/* Button Container */}
        <div className="mt-3 md:mt-0">
          {!address || isValid ? (
            <button
              onClick={handleSubmit}
              disabled={!isValid || isLoading}
              style={
                isValid
                  ? {
                      background:
                        "linear-gradient(94.61deg,#fffaf3 -4.98%,#fff200 32.6%,#01e1e0 114.17%)",
                    }
                  : {}
              }
              className={`w-full md:w-auto md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 
                py-3 md:py-2 px-4 rounded-xl
                font-medium transition-all
                disabled:opacity-30 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
                ${isValid ? "text-black" : "bg-zinc-800 text-zinc-500"}`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-xl animate-spin" />
                  Loading...
                </>
              ) : (
                "Flash Me ⚡"
              )}
            </button>
          ) : (
            <button
              onClick={handleClear}
              className="w-full md:w-auto md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 
                py-3 md:py-2 px-4 rounded-xl
                font-medium transition-all
                bg-red-500 hover:bg-red-600 text-white
                flex items-center justify-center gap-2"
            >
              <XMarkIcon className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
