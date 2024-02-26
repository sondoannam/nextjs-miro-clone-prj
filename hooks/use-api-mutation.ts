import { useState } from "react";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

// type mutationPayload = {
//   boardId?: Id<"boards">;
//   [key: string]: any;
// }

export const useApiMutation = (mutationFunction: any) => {
  const [pending, setPending] = useState<boolean>(false);
  const apiMutation = useMutation(mutationFunction);

  const mutate = async (payload: any) => {
    setPending(true);
    return apiMutation(payload)
      .finally(() => setPending(false))
      .then((result) => result)
      .catch((error) => {
        throw error;
      });
  };

  return {
    mutate,
    pending,
  };
};
