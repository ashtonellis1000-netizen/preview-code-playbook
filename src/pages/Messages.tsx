import { BottomNavigation } from "@/components/BottomNavigation";
import { MessageThreadList } from "@/features/messaging/components/message-thread-list";
import { useAuth } from "@/app/providers/auth";
import { Button } from "@/components/ui/button";

const Messages = () => {
  const { status } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-6 pb-24 mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Messages</h1>
            <p className="text-sm text-muted-foreground">Collaborate with shops and manage quotes in one inbox.</p>
          </div>
          <Button variant="outline" size="sm">
            New message
          </Button>
        </div>

        {status === "unauthenticated" ? (
          <div className="rounded-xl border border-dashed border-border p-6 space-y-3 text-sm text-muted-foreground">
            <p>
              Sign in to unlock messaging. Once authenticated, your quote conversations and DMs will sync here automatically.
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <a href="/auth/sign-in?redirectTo=/messages">Sign in</a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href="/auth/sign-up?redirectTo=/messages">Create account</a>
              </Button>
            </div>
          </div>
        ) : (
          <MessageThreadList />
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Messages;
