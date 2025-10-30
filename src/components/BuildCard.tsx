import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Bookmark, Share2, DollarSign, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";

interface BuildStage {
  id: string;
  title: string;
  image: string;
  description: string;
}

interface BuildCardProps {
  id: string;
  shopName: string;
  shopVerified: boolean;
  carModel: string;
  buildTitle: string;
  stages: BuildStage[];
  stats: {
    horsepower: number;
    torque: number;
    zeroToSixty: number;
    quarterMile: number;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

export const BuildCard = ({
  id,
  shopName,
  shopVerified,
  carModel,
  buildTitle,
  stages,
  stats,
  likes,
  comments,
  isLiked: initialLiked,
  isSaved: initialSaved,
}: BuildCardProps) => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isSaved, setIsSaved] = useState(initialSaved);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("likes").upsert({
        user_id: user.id,
        build_id: id,
        liked: !isLiked,
      });
    }
  };

  const handleSave = async () => {
    setIsSaved(!isSaved);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("saves").upsert({
        user_id: user.id,
        build_id: id,
        saved: !isSaved,
      });
    }
  };

  const handleStageClick = () => navigate(`/build/${id}`);

  return (
    <div className="h-screen w-full snap-start snap-always relative bg-gradient-carbon overflow-hidden">
      {/* Build Stage Image */}
      <div className="absolute inset-0">
        <img
          src={stages[currentStage].image}
          alt={stages[currentStage].title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Stage Navigation Dots */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {stages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStage(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentStage
                ? "w-8 bg-primary shadow-glow-primary"
                : "w-1.5 bg-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Build Image Click Area */}
      <button
        onClick={handleStageClick}
        className="absolute inset-0 z-0"
        aria-label="View build details"
      />

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 space-y-4 z-10">
        {/* Shop Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-performance flex items-center justify-center text-white font-bold text-lg">
            {shopName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">{shopName}</span>
              {shopVerified && (
                <CheckCircle className="w-5 h-5 text-verified fill-verified" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{carModel}</p>
          </div>
        </div>

        {/* Build Title */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{buildTitle}</h2>
          <p className="text-muted-foreground">{stages[currentStage].description}</p>
        </div>

        {/* Performance Stats */}
        <div className="bg-card/80 backdrop-blur-lg rounded-xl p-4 border border-border">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.horsepower}</div>
              <div className="text-xs text-muted-foreground">HP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.torque}</div>
              <div className="text-xs text-muted-foreground">TQ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{stats.zeroToSixty}</div>
              <div className="text-xs text-muted-foreground">0-60</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{stats.quarterMile}</div>
              <div className="text-xs text-muted-foreground">1/4 MI</div>
            </div>
          </div>
        </div>

        {/* Stage Badge */}
        <Badge variant="secondary" className="w-fit">
          {stages[currentStage].title}
        </Badge>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-10">
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isLiked ? "bg-primary shadow-glow-primary" : "bg-card/80 backdrop-blur-lg"
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-white text-white" : "text-foreground"}`} />
          </div>
          <span className="text-xs font-medium text-foreground">{likes + (isLiked && !initialLiked ? 1 : 0)}</span>
        </button>

        <button 
          onClick={() => navigate(`/build/${id}/comments`)}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 rounded-full bg-card/80 backdrop-blur-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-xs font-medium text-foreground">{comments}</span>
        </button>

        <button
          onClick={handleSave}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isSaved ? "bg-accent shadow-glow-accent" : "bg-card/80 backdrop-blur-lg"
            }`}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? "fill-white text-white" : "text-foreground"}`} />
          </div>
        </button>

        <button 
          onClick={() => navigate(`/quote/${id}`)}
          className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-performance flex items-center justify-center shadow-glow-primary">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-medium text-foreground">Quote</span>
        </button>

        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: buildTitle,
                text: `Check out this ${carModel} build by ${shopName}`,
                url: window.location.origin + `/build/${id}`,
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
    </div>
  );
};
