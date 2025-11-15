import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/providers/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  useMessageThread,
  useRealtimeThreadSubscription,
} from "../hooks/use-message-thread";
import { useSendMessage } from "../hooks/use-send-message";

interface MessageThreadViewProps {
  threadId: string | undefined;
}

export const MessageThreadView = ({ threadId }: MessageThreadViewProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const threadQuery = useMessageThread(threadId);
  useRealtimeThreadSubscription(threadId);
  const sendMessage = useSendMessage(threadId);

  const isViewer = (userId: string) => session?.user.id === userId;

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session) {
      toast({
        title: "Sign in required",
        description: "Create an account or sign in to reply.",
        variant: "destructive",
      });
      return;
    }

    if (!draft.trim()) {
      toast({ title: "Add a message", description: "Your reply cannot be empty." });
      return;
    }

    try {
      await sendMessage.mutateAsync(draft.trim());
      setDraft("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to send",
        description: "We couldn't reach the thread. Try again shortly.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadQuery.data?.messages.length]);

  if (threadQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading thread…</p>;
  }

  if (!threadQuery.data) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Conversation not found. It may have been archived.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <Card className="flex-1 overflow-hidden">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-lg">
            {threadQuery.data.counterpartName}
            {threadQuery.data.buildTitle ? ` • ${threadQuery.data.buildTitle}` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto py-4">
          {threadQuery.data.messages.length === 0 && (
            <p className="text-sm text-muted-foreground">No messages yet. Start the conversation.</p>
          )}
          {threadQuery.data.messages.map((message) => (
            <div
              key={message.id}
              className={`flex w-full ${isViewer(message.senderId) ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  isViewer(message.senderId)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p>{message.body ?? ""}</p>
                <p className="pt-1 text-[10px] uppercase tracking-wide opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </CardContent>
      </Card>

      <form onSubmit={handleSend} className="flex flex-col gap-2 md:flex-row">
        <Textarea
          className="min-h-[80px] flex-1"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={session ? "Write your reply" : "Sign in to send a message"}
          disabled={!session || sendMessage.isPending}
        />
        <Button type="submit" disabled={!session || sendMessage.isPending} className="md:w-40">
          {sendMessage.isPending ? "Sending…" : "Send"}
        </Button>
      </form>
    </div>
  );
};
