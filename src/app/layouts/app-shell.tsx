import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export const AppShell = () => {
  return (
    <>
      <Suspense fallback={<div className="p-8 text-muted-foreground">Loading SPEC…</div>}>
        <Outlet />
      </Suspense>
      <Toaster />
      <Sonner />
    </>
  );
};
