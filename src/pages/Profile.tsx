import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/app/providers/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabase } from "@/app/providers/supabase";
import { useToast } from "@/hooks/use-toast";
import { ShopVerificationRequest } from "@/features/shops/components/shop-verification-request";

export default function Profile() {
  const { session, profile, status, signOut, refreshProfile } = useAuth();
  const supabase = useSupabase();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? "");
    setUsername(profile?.username ?? "");
  }, [profile]);

  const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;

    setIsSaving(true);

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: session.user.id,
        display_name: displayName || null,
        username: username || null,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      toast({
        title: "Could not update profile",
        description: error.message,
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    await refreshProfile();

    toast({
      title: "Profile updated",
      description: "Your SPEC identity is ready for the feed.",
    });

    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-6 pb-24 px-6 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your SPEC identity</h1>
          <p className="text-sm text-muted-foreground">
            Manage your builder profile, saved builds, and verification path.
          </p>
        </div>

        {status === "loading" && <p className="text-muted-foreground">Checking your session…</p>}

        {status !== "loading" && !session && (
          <Card>
            <CardHeader>
              <CardTitle>Sign in to personalise SPEC</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Create an account to sync saved builds, manage quotes, and message verified shops.</p>
              <div className="flex gap-2 pt-2">
                <Button asChild>
                  <Link to="/auth/sign-in">Sign in</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/auth/sign-up">Create account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {session && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your SPEC profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display name</Label>
                    <Input
                      id="display-name"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      placeholder="SPEC Builder"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="@builder"
                    />
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Email: {session.user.email ?? "—"}</p>
                    <p>Role: {profile?.role ?? "builder"}</p>
                    <p>User ID: {session.user.id}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving…" : "Save changes"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => signOut()}>
                      Sign out
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <ShopVerificationRequest />
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
}
