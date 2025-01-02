import { useToast } from "@/app/components/ToastContext";

export const useCopyToClipboard = () => {
  const { showToast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard", "success");
    } catch (error) {
      showToast("Failed to copy address", "error");
    }
  };

  return { copyToClipboard };
};
