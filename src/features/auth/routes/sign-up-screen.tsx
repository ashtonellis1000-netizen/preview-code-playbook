import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthPageShell } from "../components/auth-page-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/app/providers/supabase";
import { useToast } from "@/hooks/use-toast";

export const SignUpScreen = () => {
  const supabase = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = searchParams.get("redirectTo") ?? "/feed";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/sign-in`,
      },
    });

    if (error) {
      toast({
        title: "Unable to create account",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: data.user.id,
        display_name: displayName || null,
        username: username || null,
      });

      if (profileError) {
        console.warn("Failed to store profile", profileError);
      }
    }

    toast({
      title: "Check your inbox",
      description:
        data.session
          ? "You're all set. Welcome to SPEC!"
          : "We sent you a confirmation link to finish creating your SPEC account.",
    });

    if (data.session) {
      navigate(redirectTo, { replace: true });
    } else {
      navigate("/auth/sign-in", { replace: true });
    }
  };

  return (
    <AuthPageShell
      title="Create your SPEC account"
      subtitle="Join the community to follow builds, request quotes, and message shops."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="SPEC Builder"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username (optional)</Label>
          <Input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="@builder"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <Link className="text-primary hover:underline" to={`/auth/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`}>
          Sign in instead
        </Link>
      </p>
    </AuthPageShell>
  );
};
