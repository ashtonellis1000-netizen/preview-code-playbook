import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "./query-client";
import { SupabaseProvider } from "./supabase";
import { AuthProvider } from "./auth";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryProvider>
    <SupabaseProvider>
      <AuthProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
    </SupabaseProvider>
  </QueryProvider>
);
