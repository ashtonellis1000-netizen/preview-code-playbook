import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface VerificationRequestPayload {
  shopId: string;
  submittedBy: string;
  notes: string | null;
}

export const submitVerificationRequest = async (
  client: SupabaseClient<Database>,
  payload: VerificationRequestPayload
) => {
  const { error } = await client.from("shop_verification_requests").insert({
    shop_id: payload.shopId,
    submitted_by: payload.submittedBy,
    notes: payload.notes,
    status: "pending",
  });

  if (error) {
    throw error;
  }
};
