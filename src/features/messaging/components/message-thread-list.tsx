import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useMessageThreads } from "../hooks/use-message-threads";

const formatTimestamp = (timestamp: string | null) => {
  if (!timestamp) return "New";
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    console.warn("Failed to format timestamp", error);
    return "Recently";
  }
};

export const MessageThreadList = () => {
  const { data, isLoading } = useMessageThreads();

  if (!isLoading && (!data || data.length === 0)) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No conversations yet. Request a quote from a verified shop to start collaborating.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {isLoading && <div className="text-sm text-muted-foreground">Loading inbox…</div>}
      {(data ?? []).map((thread) => (
        <Card key={thread.id}>
          <CardContent className="py-4">
            <Link to={`/messages/${thread.id}`} className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{thread.counterpartName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">{thread.counterpartName}</p>
                <p className="text-xs text-muted-foreground">
                  {thread.lastMessageSnippet ?? "No messages yet"}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Updated {formatTimestamp(thread.lastMessageAt)}
                </p>
              </div>
              {thread.unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {thread.unreadCount} new
                </span>
              )}
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
