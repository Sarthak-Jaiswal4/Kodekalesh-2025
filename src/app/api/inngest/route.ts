import { inngest } from "@/inngest/client";
import { assign_judge } from "@/inngest/function/judge_assign";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    assign_judge
  ],
});