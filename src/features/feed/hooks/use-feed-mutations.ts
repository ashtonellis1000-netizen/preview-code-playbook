import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";
import { useAuth } from "@/app/providers/auth";
import { useToast } from "@/hooks/use-toast";
import { FEED_QUERY_KEY } from "./use-feed";
import { toggleLike } from "../api/toggle-like";
import { toggleSave } from "../api/toggle-save";
import type { BuildFeedItem } from "../api/get-build-feed";

const AUTH_ERROR = "AUTH_REQUIRED";

type ViewerMutation = {
  buildId: string;
  nextValue: boolean;
  filter: string;
};

type FeedCache = BuildFeedItem[] | undefined;

export const useFeedMutations = () => {
  const supabase = useSupabase();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const applyOptimisticUpdate = (
    cache: FeedCache,
    buildId: string,
    updates: (item: BuildFeedItem) => BuildFeedItem
  ): FeedCache => {
    if (!cache) return cache;
    return cache.map((item) => (item.id === buildId ? updates(item) : item));
  };

  const likeMutation = useMutation<
    void,
    Error & { code?: string },
    ViewerMutation,
    { previous: FeedCache | undefined }
  >({
    mutationFn: async ({ buildId, nextValue }: ViewerMutation) => {
      if (!session) {
        const error = new Error("Sign in required");
        (error as Error & { code?: string }).code = AUTH_ERROR;
        throw error;
      }

      await toggleLike(supabase, { buildId, nextValue, userId: session.user.id });
    },
    onMutate: async ({ buildId, nextValue, filter }) => {
      await queryClient.cancelQueries({ queryKey: [FEED_QUERY_KEY, filter] });

      const previous = queryClient.getQueryData<FeedCache>([
        FEED_QUERY_KEY,
        filter,
      ]);

      queryClient.setQueryData<FeedCache>([FEED_QUERY_KEY, filter], (cache) =>
        applyOptimisticUpdate(cache, buildId, (item) => ({
          ...item,
          viewerHasLiked: nextValue,
          likes: Math.max(0, item.likes + (nextValue ? 1 : -1)),
        }))
      );

      return { previous };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        [FEED_QUERY_KEY, variables.filter],
        context?.previous ?? undefined
      );

      const errorCode = (error as Error & { code?: string }).code;
      if (errorCode === AUTH_ERROR) {
        toast({
          title: "Sign in to like builds",
          description: "Create a SPEC account or log in to save your reactions.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Unable to update like",
        description: "Please try again in a few moments.",
        variant: "destructive",
      });
    },
    onSettled: (_result, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: [FEED_QUERY_KEY, variables.filter] });
    },
  });

  const saveMutation = useMutation<
    void,
    Error & { code?: string },
    ViewerMutation,
    { previous: FeedCache | undefined }
  >({
    mutationFn: async ({ buildId, nextValue }: ViewerMutation) => {
      if (!session) {
        const error = new Error("Sign in required");
        (error as Error & { code?: string }).code = AUTH_ERROR;
        throw error;
      }

      await toggleSave(supabase, { buildId, nextValue, userId: session.user.id });
    },
    onMutate: async ({ buildId, nextValue, filter }) => {
      await queryClient.cancelQueries({ queryKey: [FEED_QUERY_KEY, filter] });

      const previous = queryClient.getQueryData<FeedCache>([
        FEED_QUERY_KEY,
        filter,
      ]);

      queryClient.setQueryData<FeedCache>([FEED_QUERY_KEY, filter], (cache) =>
        applyOptimisticUpdate(cache, buildId, (item) => ({
          ...item,
          viewerHasSaved: nextValue,
        }))
      );

      return { previous };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        [FEED_QUERY_KEY, variables.filter],
        context?.previous ?? undefined
      );

      const errorCode = (error as Error & { code?: string }).code;
      if (errorCode === AUTH_ERROR) {
        toast({
          title: "Sign in to save builds",
          description: "Create a SPEC account or log in to build your watch list.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Unable to update save",
        description: "Please try again shortly.",
        variant: "destructive",
      });
    },
    onSettled: (_result, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: [FEED_QUERY_KEY, variables.filter] });
    },
  });

  return {
    toggleLike: (filter: string, buildId: string, nextValue: boolean) =>
      likeMutation.mutate({ filter, buildId, nextValue }),
    toggleSave: (filter: string, buildId: string, nextValue: boolean) =>
      saveMutation.mutate({ filter, buildId, nextValue }),
  };
};
