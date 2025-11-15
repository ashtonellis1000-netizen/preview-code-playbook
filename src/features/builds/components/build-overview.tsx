import { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BuildDetail } from "@/features/builds/api/get-build";

interface BuildOverviewProps {
  build: BuildDetail;
}

const formatCurrency = (value: number | null | undefined) => {
  if (typeof value !== "number") return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  } catch (error) {
    console.warn("Failed to format currency", error);
    return `$${value.toLocaleString()}`;
  }
};

const formatMileage = (value: number | null | undefined) => {
  if (typeof value !== "number") return "—";
  return `${value.toLocaleString()} mi`;
};

export const BuildOverview = ({ build }: BuildOverviewProps) => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-performance flex items-center justify-center text-white font-bold text-lg">
            {(build.shop.name ?? "S").charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-foreground">{build.title}</h1>
              {build.shop.verified && <Badge className="bg-verified text-background">Verified</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{build.headline ?? "Build overview coming soon"}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card/80 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Shop</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{build.shop.name ?? "Pending assignment"}</p>
              <p className="text-xs text-muted-foreground">SPEC verified shops unlock quoting and messaging.</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Engagement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">{build.likes}</span> likes
              </p>
              <p>
                <span className="font-semibold text-foreground">{build.comments}</span> comments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Performance</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">HP</p>
                <p>{build.stats.horsepower ?? "—"}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Torque</p>
                <p>{build.stats.torque ?? "—"}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">0-60</p>
                <p>{build.stats.zeroToSixty ?? "—"}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">1/4 mile</p>
                <p>{build.stats.quarterMile ?? "—"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {build.vehicleSpecs && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Vehicle spec sheet</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">VIN</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground">
                {build.vehicleSpecs.vin ?? "—"}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Exterior</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground">
                {build.vehicleSpecs.exteriorColor ?? "—"}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Interior</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground">
                {build.vehicleSpecs.interiorColor ?? "—"}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Mileage</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground">
                {formatMileage(build.vehicleSpecs.mileage)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Acquired from</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground">
                {build.vehicleSpecs.acquisitionSource ?? "—"}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Asking price</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground">
                {formatCurrency(build.vehicleSpecs.askingPrice)}
              </CardContent>
            </Card>
          </div>
          {build.vehicleSpecs.conditionNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Condition notes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-foreground">
                {build.vehicleSpecs.conditionNotes}
              </CardContent>
            </Card>
          )}
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Build timeline</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {build.stages.map((stage) => (
            <Card key={stage.id} className="overflow-hidden">
              <img src={stage.image} alt={stage.title} className="h-40 w-full object-cover" />
              <CardHeader>
                <CardTitle className="text-lg">{stage.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stage.description ?? "Update coming soon"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {build.modLists.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Mod lists</h2>
            <p className="text-sm text-muted-foreground">
              Breakdown of parts, manufacturers, and install status curated by the build team.
            </p>
          </div>
          <div className="space-y-4">
            {build.modLists.map((list) => (
              <Card key={list.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{list.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {list.items.length === 0 && (
                    <p className="text-sm text-muted-foreground">No parts have been documented yet.</p>
                  )}
                  {list.items.map((item) => (
                    <Fragment key={item.id}>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center justify-between text-foreground">
                          <span className="font-medium">{item.partName}</span>
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            {item.status ?? "planned"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {[item.manufacturer, item.partNumber, item.category]
                            .filter(Boolean)
                            .join(" • ") || "Details pending"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Cost: {formatCurrency(item.cost)}
                        </div>
                      </div>
                      <hr className="border-border/70" />
                    </Fragment>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {build.updates.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Project updates</h2>
            <p className="text-sm text-muted-foreground">Chronological progress shared by the builder or shop.</p>
          </div>
          <div className="space-y-4">
            {build.updates.map((update) => (
              <Card key={update.id}>
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{update.title ?? "Update"}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {new Date(update.createdAt).toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  {update.body && <p>{update.body}</p>}
                  {typeof update.progressPercent === "number" && (
                    <p className="text-xs uppercase tracking-wide text-foreground">
                      Progress: {update.progressPercent}%
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
