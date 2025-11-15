import userModel from "@/models/user.model";
import { NonRetriableError } from "inngest";
import { analyzecase } from "@/AI";
import { inngest } from "@/inngest/client";

export const assign_judge = inngest.createFunction(
  { id: "assign" },
  { event: "assign/judge" },
  async ({ event, step }) => {
    try {
      const caseData = event.data.caseData;
        console.log(caseData)
      const all_judges = await step.run("get-all-judges", async () => {
        const judges = await userModel.find();
        if (!judges) {
          throw new NonRetriableError("no judges found");
        }
        console.log(judges)
        return judges;
      });

      const agent = await step.run("call-agent", async () => {
        const caseDataJSON = JSON.stringify(caseData);
        const judgeProfilesJSON = JSON.stringify(all_judges);
        const ticket = { caseDataJSON, judgeProfilesJSON };
        const response = await analyzecase(ticket);
        console.log(response);
        return response;
      });
    } catch (error) {
        console.log(error)
      throw new NonRetriableError("server error");
    }
    return { success: true };
  }
);