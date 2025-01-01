"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isValidSolanaAddress } from "@/src/lib/utils/validators";
import { useToast } from "@/app/components/ToastContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Modal from "@/app/components/Modal";
import Link from "next/link";

export default function Home() {
  // State management for the input form
  const [address, setAddress] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  // Handle address validation as user types
  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.length > 0) {
      setIsValid(isValidSolanaAddress(value));
    } else {
      setIsValid(null);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isValid || isLoading) return;
    setIsLoading(true);

    try {
      // Check if wallet exists in Flash Trade
      const response = await fetch(
        `https://api.prod.flash.trade/trading-history/find-all-by-user-v2/${address}`
      );
      const data = await response.json();

      if (!response.ok || !data || data.length === 0) {
        throw new Error("This wallet has not been used on Flash Trade");
      }

      // Prefetch the data while showing loading animation
      router.prefetch(`/${address}`);
      router.push(`/${address}/loading`);

      // Start preloading data
      fetch(
        `https://api.prod.flash.trade/trading-history/find-all-by-user-v2/${address}`
      ).catch((error) => {
        console.error("Failed to preload data:", error);
      });
    } catch (error: any) {
      showToast(error.message || "Failed to fetch wallet data", "error");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[calc(100vh)] flex items-center justify-center"
    >
      <div className="flex flex-col items-center max-w-2xl mx-auto space-y-8 px-4">
        {/* Title with animation */}
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-4xl md:text-[4.5rem] text-center tracking-tighter font-bold"
        >
          ⚡ Flash Stats
        </motion.h1>

        {/* Input Container */}
        <div className="w-full relative">
          <input
            type="text-[16px]"
            value={address}
            onChange={(e) => handleAddressChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValid) {
                handleSubmit();
              }
            }}
            className={`
              w-full px-4 py-3 rounded-xl transition-colors focus:ring-0
              text-sm md:text-base text-ellipsis overflow-hidden whitespace-nowrap
              ${
                isValid === true
                  ? "border-2 border-green-500 focus:border-green-600"
                  : isValid === false
                  ? "border-2 border-red-500 focus:border-red-600"
                  : "border-2 border-zinc-800 focus:border-zinc-700"
              }
              bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none
            `}
            placeholder="Enter Solana Wallet Address"
            disabled={isLoading}
          />

          {/* Action Button */}
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
                className={`
                  w-full md:w-auto md:absolute md:right-1.5 md:top-1/2 md:-translate-y-1/2 
                  py-3 md:py-2 px-4 rounded-lg font-medium transition-all
                  disabled:opacity-30 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2
                  ${isValid ? "text-black" : "bg-zinc-800 text-zinc-500"}
                `}
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
                onClick={() => {
                  setAddress("");
                  setIsValid(null);
                }}
                className="
                  w-full md:w-auto md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 
                  py-3 md:py-2 px-4 rounded-xl font-medium transition-all
                  bg-red-500 hover:bg-red-600 text-white
                  flex items-center justify-center gap-2
                "
              >
                <XMarkIcon className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="dark:text-slate-400 text-slate-700 text-center px-4 text-sm md:text-base"
        >
          This is a beta product designed to help you see your profitability on{" "}
          <Link
            href="https://beast.flash.trade?referral=Beast_2972"
            target="_blank"
            className="hover:underline text-yellow-300"
          >
            Flash Trade.
          </Link>
        </motion.p>

        {/* Disclaimer Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="hover:underline text-yellow-300"
        >
          Disclaimer
        </button>

        {/* Modal for Disclaimer */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-lg font-bold mb-4">Disclaimer</h2>
          <p>This project has no affiliation with Flash Trade.</p>
          <p className="mt-4">
            The site is not perfect, but it&apos;s a good start. Any feedback is
            welcome. If you find any bugs, please report them to{" "}
            <Link
              href="https://twitter.com/MightieMags"
              target="_blank"
              className="hover:underline text-yellow-300"
            >
              @MightieMags
            </Link>{" "}
            on Twitter. No guarantees are made about accuracy.
          </p>
        </Modal>
      </div>
    </motion.div>
  );
}
