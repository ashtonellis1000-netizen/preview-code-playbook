import { useMutation } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";

interface CreatePaymentIntentPayload {
  quoteId: string;
  payerId: string;
  amount: number;
  currency?: string;
}

interface CreatePaymentIntentResponse {
  checkoutUrl: string | null;
}

export const useCreatePaymentIntent = () => {
  const client = useSupabase();

  return useMutation<CreatePaymentIntentResponse, Error, CreatePaymentIntentPayload>({
    mutationFn: async (payload) => {
      const response = await client.functions.invoke<CreatePaymentIntentResponse>("create-payment-intent", {
        body: JSON.stringify(payload),
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    },
  });
};
