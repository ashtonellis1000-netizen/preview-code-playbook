import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShopDetail } from "../api/get-shop";

interface ShopProfileProps {
  shop: ShopDetail | null;
  isLoading: boolean;
}

export const ShopProfile = ({ shop, isLoading }: ShopProfileProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!shop) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Shop not found. It may have been removed or is not yet public.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl text-foreground">{shop.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {[shop.city, shop.state].filter(Boolean).join(", ") || "Location coming soon"}
            </p>
          </div>
          {shop.verified && <Badge className="bg-verified text-background">Verified shop</Badge>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {shop.description ?? "This shop hasn’t added a description yet. Check back as they complete their profile."}
          </p>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Published builds</h2>
          <p className="text-sm text-muted-foreground">{shop.builds.length} builds</p>
        </div>

        {shop.builds.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              This shop hasn’t published any builds yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {shop.builds.map((build) => (
              <Card key={build.id} className="overflow-hidden">
                {build.coverUrl && (
                  <img src={build.coverUrl} alt={build.title} className="h-40 w-full object-cover" />
                )}
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{build.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <a href={`/build/${build.id}`} className="text-sm font-medium text-primary hover:underline">
                    View build
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
