"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface LoadingPageProps {
  params: {
    address: string;
  };
}

export default function LoadingPage({ params }: LoadingPageProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        router.replace(`/${params.address}`);
      });
      
      videoRef.current.onended = () => {
        router.replace(`/${params.address}`);
      };
    }

    const fallbackTimer = setTimeout(() => {
      router.replace(`/${params.address}`);
    }, 4000);

    return () => clearTimeout(fallbackTimer);
  }, [params.address, router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="w-full h-full max-w-3xl max-h-screen relative">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          loop
          className="w-full h-full object-contain"
          preload="auto"
        >
          <source src="/flashme.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
