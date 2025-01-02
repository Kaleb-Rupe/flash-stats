import { useIsMounted } from "@/app/hooks/useIsMounted";
import { ReactNode } from "react";

export function ClientOnly({ children }: { children: ReactNode }) {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
}
