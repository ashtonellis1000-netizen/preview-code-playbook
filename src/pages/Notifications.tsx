import { BottomNavigation } from "@/components/BottomNavigation";
import { NotificationList } from "@/features/notifications/components/notification-list";
import { useAuth } from "@/app/providers/auth";

export default function Notifications() {
  const { status } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-6 pb-24 px-6 max-w-3xl mx-auto space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay up to date on likes, comments, quotes, and DM responses from the SPEC community.
          </p>
        </div>

        {status === "unauthenticated" ? (
          <div className="rounded-xl border border-dashed border-border p-6 space-y-3 text-sm text-muted-foreground">
            <p>Sign in to see your latest activity. We’ll sync alerts across devices once you authenticate.</p>
            <div className="flex gap-2">
              <a
                href="/auth/sign-in?redirectTo=/notifications"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Sign in
              </a>
              <a
                href="/auth/sign-up?redirectTo=/notifications"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Create account
              </a>
            </div>
          </div>
        ) : (
          <NotificationList />
        )}
      </div>
      <BottomNavigation />
    </div>
  );
}
