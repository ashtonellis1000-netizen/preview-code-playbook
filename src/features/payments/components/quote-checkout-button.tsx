import { Button } from "@/components/ui/button";
import { useCreatePaymentIntent } from "../hooks/use-create-payment-intent";
import { useToast } from "@/hooks/use-toast";

interface QuoteCheckoutButtonProps {
  quoteId: string;
  payerId: string | undefined;
  amountCents: number;
}

export const QuoteCheckoutButton = ({ quoteId, payerId, amountCents }: QuoteCheckoutButtonProps) => {
  const { toast } = useToast();
  const mutation = useCreatePaymentIntent();

  const handleCheckout = async () => {
    if (!payerId) {
      toast({
        title: "Sign in required",
        description: "Sign in before completing checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      toast({
        title: "Enter an amount",
        description: "Specify a deposit before starting checkout.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { checkoutUrl } = await mutation.mutateAsync({
        quoteId,
        payerId,
        amount: amountCents,
      });

      if (!checkoutUrl) {
        throw new Error("Missing checkout URL from Stripe");
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to start checkout",
        description: error instanceof Error ? error.message : "Unexpected error", 
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={mutation.isPending}>
      {mutation.isPending ? "Processing…" : "Checkout with Stripe"}
    </Button>
  );
};
