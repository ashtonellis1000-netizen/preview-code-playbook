import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useShopsQuery } from "../hooks/use-shops";

export const ShopDirectory = () => {
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const { data, isLoading } = useShopsQuery(verifiedOnly);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shop Directory</h1>
          <p className="text-sm text-muted-foreground">
            Discover certified builders and request quotes instantly.
          </p>
        </div>
        <Button
          variant={verifiedOnly ? "default" : "outline"}
          onClick={() => setVerifiedOnly((prev) => !prev)}
        >
          {verifiedOnly ? "Showing Verified" : "Include All"}
        </Button>
      </div>

      {isLoading && <div className="text-sm text-muted-foreground">Loading shops…</div>}

      <div className="grid gap-4 md:grid-cols-2">
        {(data ?? []).map((shop) => (
          <Card key={shop.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-xl font-semibold">
                <Link to={`/shops/${shop.id}`} className="hover:underline">
                  {shop.name}
                </Link>
              </CardTitle>
              {shop.verified && <Badge>Verified</Badge>}
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>{shop.city ? `${shop.city}${shop.state ? `, ${shop.state}` : ""}` : "Location pending"}</div>
              <div>{shop.buildsPublished} showcase builds</div>
              <Link to={`/shops/${shop.id}`} className="text-sm font-medium text-primary hover:underline">
                View profile
              </Link>
            </CardContent>
          </Card>
        ))}

        {!isLoading && (data?.length ?? 0) === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No shops have published builds yet. Invite partners to onboard via SPEC Studio.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
