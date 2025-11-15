import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, CheckCircle, DollarSign, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BuildFeedItem } from "../api/get-build-feed";

interface BuildCardProps {
  build: BuildFeedItem;
  onRequestQuote?: (build: BuildFeedItem) => void;
  onToggleLike?: (buildId: string, nextValue: boolean) => Promise<void> | void;
  onToggleSave?: (buildId: string, nextValue: boolean) => Promise<void> | void;
}

export const BuildCard = ({ build, onRequestQuote, onToggleLike, onToggleSave }: BuildCardProps) => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [isLiked, setIsLiked] = useState(build.viewerHasLiked);
  const [isSaved, setIsSaved] = useState(build.viewerHasSaved);
  const [likeCount, setLikeCount] = useState(build.likes);

  useEffect(() => {
    setIsLiked(build.viewerHasLiked);
    setIsSaved(build.viewerHasSaved);
    setLikeCount(build.likes);
  }, [build.viewerHasLiked, build.viewerHasSaved, build.likes]);

  const stats = useMemo(() => {
    return [
      { label: "HP", value: build.stats.horsepower, accent: "text-primary" },
      { label: "TQ", value: build.stats.torque, accent: "text-primary" },
      { label: "0-60", value: build.stats.zeroToSixty, accent: "text-accent" },
      { label: "1/4 MI", value: build.stats.quarterMile, accent: "text-accent" },
    ].filter((stat) => stat.value !== null && stat.value !== undefined);
  }, [build.stats]);

  const handleLike = () => {
    const nextValue = !isLiked;
    setIsLiked(nextValue);
    setLikeCount((previous) => Math.max(0, previous + (nextValue ? 1 : -1)));
    void onToggleLike?.(build.id, nextValue);
  };

  const handleSave = () => {
    const nextValue = !isSaved;
    setIsSaved(nextValue);
    void onToggleSave?.(build.id, nextValue);
  };

  const handleQuote = () => {
    onRequestQuote?.(build);
    navigate(`/quote/${build.id}`);
  };

  const activeStage = build.stages[currentStage] ?? build.stages[0];

  return (
    <article className="h-screen w-full snap-start snap-always relative bg-gradient-carbon overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={activeStage?.image ?? build.coverUrl ?? ""}
          alt={activeStage?.title ?? build.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {build.stages.map((stage, index) => (
          <button
            key={stage.id}
            onClick={() => setCurrentStage(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentStage ? "w-8 bg-primary shadow-glow-primary" : "w-1.5 bg-foreground/30"
            }`}
            aria-label={`View stage ${stage.title}`}
          />
        ))}
      </div>

      <button
        onClick={() => navigate(`/build/${build.id}`)}
        className="absolute inset-0 z-0"
        aria-label="View build details"
      />

      <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 space-y-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-performance flex items-center justify-center text-white font-bold text-lg">
            {(build.shop.name ?? "S").charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">{build.shop.name ?? "Verified Shop"}</span>
              {build.shop.verified && <CheckCircle className="w-5 h-5 text-verified fill-verified" />}
            </div>
            <p className="text-sm text-muted-foreground">{build.headline ?? build.title}</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{build.title}</h2>
          {activeStage?.description && <p className="text-muted-foreground">{activeStage.description}</p>}
        </div>

        {stats.length > 0 && (
          <div className="bg-card/80 backdrop-blur-lg rounded-xl p-4 border border-border">
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-2xl font-bold ${stat.accent}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Badge variant="secondary" className="w-fit">
          {activeStage?.title ?? "Featured"}
        </Badge>
      </div>

      <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-10">
        <button onClick={handleLike} className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isLiked ? "bg-primary shadow-glow-primary" : "bg-card/80 backdrop-blur-lg"
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-white text-white" : "text-foreground"}`} />
          </div>
          <span className="text-xs font-medium text-foreground">{likeCount}</span>
        </button>

        <button
          onClick={() => navigate(`/build/${build.id}/comments`)}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground">{build.comments}</span>
        </button>

        <button onClick={handleSave} className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isSaved ? "bg-accent shadow-glow-accent" : "bg-card/80 backdrop-blur-lg"
            }`}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? "fill-white text-white" : "text-foreground"}`} />
          </div>
        </button>

        <button onClick={handleQuote} className="flex flex-col items-center gap-1 transition-transform hover:scale-110">
          <div className="w-12 h-12 rounded-full bg-gradient-performance flex items-center justify-center shadow-glow-primary">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-medium text-foreground">Quote</span>
        </button>

        <button
          onClick={() => {
            if (navigator.share) {
              void navigator.share({
                title: build.title,
                text: build.headline ?? undefined,
                url: window.location.origin + `/build/${build.id}`,
              });
            }
          }}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-lg flex items-center justify-center">
            <Share2 className="w-6 h-6 text-foreground" />
          </div>
        </button>
      </div>

      <div className="absolute left-6 bottom-8 z-10">
        <Button
          size="sm"
          variant="outline"
          className="border-border bg-card/80 backdrop-blur-lg"
          onClick={() => navigate(`/build/${build.id}`)}
        >
          View build timeline
        </Button>
      </div>
    </article>
  );
};
