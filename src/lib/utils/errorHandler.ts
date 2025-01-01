// src/utils/errorHandler.ts
import { useToast } from "@/app/components/ToastContext";
import { useState } from "react";

interface ErrorConfig {
  fallbackMessage?: string;
  showToast?: boolean;
  logToService?: boolean;
}

export const HandleError = async (
  error: unknown,
  config: ErrorConfig = {},
  showToast?: (message: string, type: string) => void
) => {
  const {
    fallbackMessage = "An unexpected error occurred",
    showToast: shouldShowToast = true,
    logToService = true,
  } = config;

  const errorMessage = error instanceof Error ? error.message : fallbackMessage;

  if (logToService) {
    console.error("[Error]:", error);
  }

  if (shouldShowToast && showToast) {
    showToast(errorMessage, "error");
  }

  return {
    message: errorMessage,
    error,
  };
};

// Custom hook for handling async operations with loading states
export const useAsyncOperation = <T>(
  operation: () => Promise<T>,
  config: ErrorConfig = {},
  showToast?: (message: string, type: string) => void
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      setData(result);
      return result;
    } catch (err) {
      const handled = await HandleError(err, config, showToast);
      setError(handled.error as Error);
      throw handled.error;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, data };
};
