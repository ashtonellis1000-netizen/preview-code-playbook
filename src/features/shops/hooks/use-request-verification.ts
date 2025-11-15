import { useMutation } from "@tanstack/react-query";
import { useSupabase } from "@/app/providers/supabase";
import { submitVerificationRequest } from "../api/request-verification";

export const useRequestVerification = () => {
  const client = useSupabase();

  return useMutation(submitVerificationRequest.bind(null, client));
};
