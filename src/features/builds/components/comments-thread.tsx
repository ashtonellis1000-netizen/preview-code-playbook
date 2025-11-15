import { formatDistanceToNow } from "date-fns";
import type { BuildComment } from "../hooks/use-comments";

interface CommentsThreadProps {
  comments: BuildComment[];
}

export const CommentsThread = ({ comments }: CommentsThreadProps) => {
  if (comments.length === 0) {
    return <p className="text-muted-foreground">No comments yet. Spark the conversation with the first question.</p>;
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li key={comment.id} className="rounded-xl border border-border bg-card/80 backdrop-blur p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>User {comment.authorId.slice(0, 6)}</span>
            <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{comment.body}</p>
        </li>
      ))}
    </ul>
  );
};
