import { FormEvent, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useOwnedShops } from "../hooks/use-owned-shops";
import { useAuth } from "@/app/providers/auth";
import { useToast } from "@/hooks/use-toast";
import { useRequestVerification } from "../hooks/use-request-verification";

export const ShopVerificationRequest = () => {
  const { session } = useAuth();
  const { data: shops } = useOwnedShops();
  const { toast } = useToast();
  const mutation = useRequestVerification();
  const [selectedShop, setSelectedShop] = useState<string>("");
  const [notes, setNotes] = useState("");

  if (!session) {
    return null;
  }

  const ownedShops = shops ?? [];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedShop) {
      toast({
        title: "Select a shop",
        description: "Choose which shop you would like SPEC to verify.",
        variant: "destructive",
      });
      return;
    }

    try {
      await mutation.mutateAsync({
        shopId: selectedShop,
        submittedBy: session.user.id,
        notes: notes.trim() ? notes.trim() : null,
      });

      toast({
        title: "Verification requested",
        description: "Our team will review your submission within 2 business days.",
      });

      setNotes("");
      setSelectedShop("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to submit",
        description: "Please try again shortly. If the issue persists contact support.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Request shop verification</CardTitle>
      </CardHeader>
      <CardContent>
        {ownedShops.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Once you publish a shop and claim ownership, you can request verification to unlock quoting and payments.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shop">Select shop</Label>
              <Select value={selectedShop} onValueChange={setSelectedShop}>
                <SelectTrigger id="shop">
                  <SelectValue placeholder="Choose a shop" />
                </SelectTrigger>
                <SelectContent>
                  {ownedShops.map((shop) => (
                    <SelectItem key={shop.id} value={shop.id} disabled={shop.verified}>
                      {shop.name} {shop.verified ? "(already verified)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Why should SPEC verify you?</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Share credentials, certifications, or community trust signals."
              />
            </div>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting…" : "Submit for review"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
