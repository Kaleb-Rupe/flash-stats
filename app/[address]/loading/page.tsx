"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface LoadingPageProps {
  params: {
    address: string;
  };
}

export default function LoadingPage({ params }: LoadingPageProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Try to play the video with fallback handling
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // If video fails to play, redirect immediately
        router.replace(`/${params.address}`);
      });

      // When video ends, redirect to the main dashboard
      videoRef.current.onended = () => {
        router.replace(`/${params.address}`);
      };
    }

    // Fallback timer in case video playback issues occur
    const fallbackTimer = setTimeout(() => {
      router.replace(`/${params.address}`);
    }, 4000);

    // Cleanup function
    return () => {
      clearTimeout(fallbackTimer);
      if (videoRef.current) {
        videoRef.current.onended = null;
      }
    };
  }, [params.address, router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black"
    >
      <div className="w-full h-full relative">
        {/* Loading video */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="w-full h-full object-contain"
          preload="auto"
        >
          <source src="/flashme.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Fallback loading indicator */}
        {videoRef.current?.play() && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white opacity-20" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
