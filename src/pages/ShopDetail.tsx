import { useParams } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ShopProfile } from "@/features/shops/components/shop-profile";
import { useShopQuery } from "@/features/shops/hooks/use-shop";

const ShopDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useShopQuery(id);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 pt-6 pb-24 mx-auto w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shop profile</h1>
          <p className="text-sm text-muted-foreground">
            Explore this builder’s verified projects, location, and quoting availability.
          </p>
        </div>
        <ShopProfile shop={data} isLoading={isLoading} />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ShopDetailPage;
