import { PropsWithChildren } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthPageShellProps extends PropsWithChildren {
  title: string;
  subtitle: string;
}

export const AuthPageShell = ({ title, subtitle, children }: AuthPageShellProps) => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
    <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  </div>
);
