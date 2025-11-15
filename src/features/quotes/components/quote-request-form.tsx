import { FormEvent, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers/auth";
import { useSupabase } from "@/app/providers/supabase";
import { useToast } from "@/hooks/use-toast";
import { QuoteCheckoutButton } from "@/features/payments/components/quote-checkout-button";

interface QuoteFormState {
  vehicle: string;
  zipCode: string;
  budget: string;
  timeline: string;
  contactEmail: string;
  description: string;
}

const initialForm: QuoteFormState = {
  vehicle: "",
  zipCode: "",
  budget: "",
  timeline: "",
  contactEmail: "",
  description: "",
};

interface QuoteRequestFormProps {
  buildId: string | undefined;
}

export const QuoteRequestForm = ({ buildId }: QuoteRequestFormProps) => {
  const { session, status } = useAuth();
  const supabase = useSupabase();
  const { toast } = useToast();
  const [formState, setFormState] = useState<QuoteFormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdQuoteId, setCreatedQuoteId] = useState<string | null>(null);

  const isDisabled = useMemo(() => {
    if (!session) return true;
    return (
      !formState.vehicle ||
      !formState.zipCode ||
      !formState.contactEmail ||
      !formState.description
    );
  }, [formState, session]);

  if (!buildId) {
    return <p className="text-destructive">Missing build identifier.</p>;
  }

  const handleChange = (field: keyof QuoteFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((previous) => ({ ...previous, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session) {
      toast({
        title: "Sign in required",
        description: "Create an account or sign in to request a quote from this shop.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        vehicle: formState.vehicle,
        zipCode: formState.zipCode,
        budget: formState.budget,
        timeline: formState.timeline,
        contactEmail: formState.contactEmail,
        description: formState.description,
      };

      const { data, error } = await supabase
        .from("quotes")
        .insert({
          build_id: buildId,
          requester_id: session.user.id,
          details: JSON.stringify(payload),
          status: "pending",
        })
        .select("id")
        .single();

      if (error || !data) {
        throw error;
      }

      toast({
        title: "Quote requested",
        description: "The shop has been notified. Expect a reply within 1-2 business days.",
      });
      setFormState(initialForm);
      setCreatedQuoteId(data.id);
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to submit",
        description: "We couldn't reach the shop. Please try again in a few minutes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <p className="text-muted-foreground">Preparing quote workspace…</p>;
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-border bg-card/60 p-6 space-y-4">
        <h2 className="text-lg font-semibold">Sign in to request a quote</h2>
        <p className="text-sm text-muted-foreground">
          You'll need an account so verified shops can message you back with pricing and next steps.
        </p>
        <div className="flex gap-2">
          <Button asChild>
            <a href={`/auth/sign-in?redirectTo=${encodeURIComponent(window.location.pathname)}`}>Sign in</a>
          </Button>
          <Button asChild variant="outline">
            <a href={`/auth/sign-up?redirectTo=${encodeURIComponent(window.location.pathname)}`}>Create account</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Vehicle</span>
          <Input
            required
            value={formState.vehicle}
            onChange={handleChange("vehicle")}
            placeholder="2023 BMW M4 Competition"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">ZIP Code</span>
            <Input
              required
              value={formState.zipCode}
              onChange={handleChange("zipCode")}
              placeholder="90210"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Budget (optional)</span>
            <Input
              value={formState.budget}
              onChange={handleChange("budget")}
              placeholder="$5,000 - $7,500"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Timeline (optional)</span>
          <Input
            value={formState.timeline}
            onChange={handleChange("timeline")}
            placeholder="Ready to start in 4 weeks"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Contact email</span>
          <Input
            required
            type="email"
            value={formState.contactEmail}
            onChange={handleChange("contactEmail")}
            placeholder="you@example.com"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-foreground">Project details</span>
          <Textarea
            required
            value={formState.description}
            onChange={handleChange("description")}
            placeholder="Tell the shop what you're looking for, current mods, ideal outcome, etc."
            rows={5}
          />
        </label>
      </div>

        <Button type="submit" disabled={isDisabled || isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Sending..." : "Send quote request"}
        </Button>
      </form>

      {createdQuoteId && (
        <QuoteDepositLauncher quoteId={createdQuoteId} payerId={session?.user.id} />
      )}
    </div>
  );
};

const parseCurrencyToCents = (value: string) => {
  const number = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  if (Number.isNaN(number)) return 0;
  return Math.round(number * 100);
};

export const QuoteDepositLauncher = ({
  quoteId,
  payerId,
}: {
  quoteId: string;
  payerId: string | undefined;
}) => {
  const [amount, setAmount] = useState("500.00");
  const cents = parseCurrencyToCents(amount);

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card/60 p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Ready to lock in your quote?</h2>
        <p className="text-sm text-muted-foreground">
          Collect a deposit via Stripe to confirm the build slot with this shop.
        </p>
      </div>
      <label className="space-y-2">
        <span className="text-sm font-medium text-foreground">Deposit amount (USD)</span>
        <Input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="500.00"
        />
      </label>
      <QuoteCheckoutButton quoteId={quoteId} payerId={payerId} amountCents={cents} />
    </div>
  );
};
