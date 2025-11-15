import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { MessageThreadView } from "@/features/messaging/components/message-thread-view";

const MessageThreadPage = () => {
  const { threadId } = useParams<{ threadId: string }>();

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-6 pb-24 mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to="/messages" aria-label="Back to inbox">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Conversation</h1>
            <p className="text-sm text-muted-foreground">Collaborate with shops and finalise project details.</p>
          </div>
        </div>

        <MessageThreadView threadId={threadId} />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default MessageThreadPage;
