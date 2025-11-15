import { BottomNavigation } from "@/components/BottomNavigation";
import { ShopDirectory } from "../components/shop-directory";

export const ShopDirectoryScreen = () => (
  <div className="min-h-screen bg-background">
    <div className="px-6 pt-6 pb-24 mx-auto w-full max-w-5xl">
      <ShopDirectory />
    </div>
    <BottomNavigation />
  </div>
);
