import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CommentsThread } from "@/features/builds/components/comments-thread";
import { useCommentsQuery } from "@/features/builds/hooks/use-comments";
import { useAuth } from "@/app/providers/auth";
import { useSupabase } from "@/app/providers/supabase";
import { useToast } from "@/hooks/use-toast";

export default function Comments() {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useCommentsQuery(id);
  const { session } = useAuth();
  const supabase = useSupabase();
  const { toast } = useToast();
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id) {
      toast({ title: "Missing build", description: "We couldn't identify this build.", variant: "destructive" });
      return;
    }

    if (!session) {
      toast({ title: "Sign in required", description: "Log in to leave a comment.", variant: "destructive" });
      return;
    }

    if (!draft.trim()) {
      toast({ title: "Add a message", description: "Please share your thoughts before sending." });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("comments").insert({
        build_id: id,
        body: draft.trim(),
        author_id: session.user.id,
      });

      if (error) throw error;

      setDraft("");
      toast({ title: "Comment posted" });
      await refetch();
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to post",
        description: "Something went wrong. Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-6 pb-24 px-6 max-w-3xl mx-auto space-y-8">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Build #{id}</p>
          <h1 className="text-3xl font-bold text-foreground">Community comments</h1>
          <p className="text-sm text-muted-foreground">Share progress feedback, ask questions, or connect with the build team.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={session ? "Drop your thoughts or questions for the builder" : "Sign in to join the conversation"}
            rows={4}
            disabled={!session}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!session || isSubmitting}>
              {isSubmitting ? "Posting..." : "Post comment"}
            </Button>
          </div>
        </form>

        {isLoading && <p className="text-muted-foreground">Loading comments…</p>}
        {isError && (
          <p className="text-destructive">Failed to load comments. We'll restore the thread shortly.</p>
        )}
        {data && <CommentsThread comments={data} />}
      </div>
      <BottomNavigation />
    </div>
  );
}
