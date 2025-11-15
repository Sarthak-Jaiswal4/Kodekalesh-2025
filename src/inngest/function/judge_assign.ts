import userModel from "@/models/user.model";
import { inngest } from "../client";
import { NonRetriableError } from "inngest";
import { analyzecase } from "../../AI";
import DBconnection from "@/lib/Connection";
import caseDetailModel from "@/models/case.model";
import mongoose from "mongoose";

await DBconnection()
export const assign_judge = inngest.createFunction(
  { id: "assign" },
  { event: "assign/judge" },
  async ({ event, step }) => {
    try {
      const caseData = event.data.caseData;
      const caseID = event.data.caseID;
      
      const all_judges = await step.run("get-all-judges", async () => {
        console.log("Processing case:", caseData);
        const judges = await userModel.find();
        if (!judges || judges.length === 0) {
          throw new NonRetriableError("no judges found");
        }
        console.log("judges found successfully")
        return judges;
      });

      const judgesWithWorkload = await step.run(
        "calculate-judge-workload",
        async () => {
          const judgesWithCounts = await Promise.all(
            all_judges.map(async (judgeDoc: any) => {

              const currentCaseLoad = await caseDetailModel.countDocuments({
                judgeId: judgeDoc._id,
                status: "Active",
              });

              return {
                ...judgeDoc,
                currentCaseLoad,
              };
            })
          );
          console.log("Calculated workloads for all judges.");
          return judgesWithCounts;
        }
      );

      const caseDataJSON = JSON.stringify(caseData);
      const judgeProfilesJSON = JSON.stringify(judgesWithWorkload);
      const ticket = { caseDataJSON, judgeProfilesJSON };
      const agentResponseObject = await analyzecase(ticket);

      let rawText: string;

      if (agentResponseObject.type === 'text') {
        if (typeof agentResponseObject.content === 'string') {
          rawText = agentResponseObject.content;
        } else if (Array.isArray(agentResponseObject.content)) {
          // If content is in array form, join all string parts
          rawText = agentResponseObject.content
            .map((item: any) => (typeof item === 'string' ? item : item.text || '')).join('');
        } else {
          throw new NonRetriableError("Agent response in unexpected format.");
        }
      } else {
        // This handles if the AI tries to call a tool or returns an error
        throw new NonRetriableError("Agent did not return a valid text response.");
      }

      const cleanedJsonString = rawText
        .replace(/^```json\s*/, "") // Remove opening tag (any whitespace after)
        .replace(/```$/, "")        // Remove closing tag at the end
        .trim();

      const parsedResponse = JSON.parse(cleanedJsonString);
      console.log(parsedResponse);

      await step.run("update-case-assignment", async () => {

        await caseDetailModel.findByIdAndUpdate(caseID, {
          $set: { 
            judgeId: new mongoose.Types.ObjectId(parsedResponse.recommendedJudgeId), 
            status: "Active" 
          },
        });
        
        console.log(`Successfully assigned case ${caseID} to judge ${parsedResponse.recommendedJudgeId}`);
        return { success: true, assignedJudgeId: parsedResponse.recommendedJudgeId, caseId:caseID };
      });

      await step.run("update-judge-cases-array", async () => {
        const judgeID=new mongoose.Types.ObjectId(parsedResponse.recommendedJudgeId)
        await userModel.findByIdAndUpdate(judgeID, {
          $addToSet: { cases: caseID }
        });
        
        console.log(`Successfully assigned case ${caseID} to judge ${parsedResponse.recommendedJudgeId}`);
        return { success: true, assignedJudgeId: parsedResponse.recommendedJudgeId, caseId:caseID };
      });

      return { success: true };

    } catch (error) {
        console.log(error)
      throw new NonRetriableError("server error");
    }
  }
);