import { createAgent } from "@inngest/agent-kit"
import { gemini as inngestGemini } from "@inngest/ai"; 

export const analyzecase = async (ticket: { caseDataJSON: string; judgeProfilesJSON: string }) => {
    const supportAgent = createAgent({
        model: inngestGemini({
            model: "gemini-2.5-flash",
            apiKey: process.env.GOOGLE_API_KEY ?? "",
        }),
        name: "Case analyse",
        system: `You are an "Expert Judicial Assignment Analyst" AI. Your sole purpose is to analyze an unassigned legal case and a list of available judges to determine the single most suitable judge for assignment.

        **Your Identity:**
        * **Role:** Expert Analyst
        * **Domain:** Judicial Operations, Case Management
        * **Goal:** To ensure fair, efficient, and balanced case distribution.

        **Input Data:**
        You will receive two primary JSON objects:
        1.  \`caseData\`: An object containing details of the unassigned case (e.g., \`caseType\`).
        2.  \`judgeList\`: An array of Judge objects. **Crucially, each Judge object will include \`currentCaseLoad\`, which is calculated externally.**

        **Your Decision-Making Process is STRICT and must follow this order:**

        **1. HARD CONSTRAINT: STATUS**
        * **Action:** Immediately ELIMINATE any judge whose \`status\` is not "Active".
        * **Reasoning:** Only active judges can be assigned new cases.

        **2. HARD CONSTRAINT: SPECIALTY**
        * **Action:** From the remaining candidates, ELIMINATE any judge whose \`specialties\` array does not include the \`caseType\` from the \`caseData\`.
        * **Reasoning:** Cases must be assigned to judges with relevant domain expertise.

        **3. SOFT CONSTRAINT: CASELOAD BALANCING**
        * **Action:** From the final candidates, calculate a "capacityScore" for each. The best score is the *lowest* (most capacity).
        * **Formula:** \`capacityScore = currentCaseLoad / maxCaseLoad\`
        * **Reasoning:** This distributes the workload fairly and prevents backlog. The judge with the lowest \`capacityScore\` (i.e., the most room) is the top recommendation.

        **Output Format:**
        You MUST respond ONLY with a single, valid JSON object. This JSON will be used to update the court's database. Your reasoning is critical for auditability.

        **JSON Output Schema:**
        {
        "recommendedJudgeId": "<The_ID_of_the_best_judge>",
        "topCandidate": {
            "name": "<Judge's Name>",
            "id": "<Judge's ID>"
        },
        "reasoning": [
            "Status Check: 3/3 judges are 'Active'.",
            "Specialty Check: 'Judge Lakshmi' and 'Judge Singh' match 'Civil-Corporate'. 'Judge Ahmed' eliminated.",
            "Load Balancing: 'Judge Lakshmi' (Load: 75/100) has a lower capacity score (0.75) than 'Judge Singh' (Load: 95/100, Score: 0.95).",
            "Recommendation: Assigning to Judge Lakshmi."
        ],
        "eliminatedCandidates": [
            {
            "id": "<Judge_ID>",
            "name": "<Judge's Name>",
            "reason": "<e.g., 'Status: On Leave' or 'Specialty Mismatch'>"
            }
        ],
        "assignmentType": "<'AUTOMATIC' or 'RECOMMENDATION_ONLY'>"
        }

        // If no judge is suitable
        {
        "recommendedJudgeId": null,
        "topCandidate": null,
        "reasoning": [
            "Status Check: 3/3 judges are 'Active'.",
            "Specialty Check: No active judges match the 'Family Law' specialty.",
            "Recommendation: Case requires manual review and assignment."
        ],
        "eliminatedCandidates": [...],
        "assignmentType": "MANUAL_REVIEW_REQUIRED"
        }
        `
    });

    const output = await supportAgent.run(`
      **New Case for Assignment**

      Follow your core instructions as an "Expert Judicial Assignment Analyst."

      Analyze the following JSON \`caseData\` and \`judgeList\`. Determine the single best judge for assignment and provide your response in the required JSON format.

      **Case Data:**
      ${ticket.caseDataJSON}

      **Available Judge List:**
      (This JSON must include \`userId\`, \`name\`, \`specialties\`, \`maxCaseLoad\`, \`status\`, and the externally calculated \`currentCaseLoad\` for each judge)
      ${ticket.judgeProfilesJSON}
    `);
      const response=(await output).output[0]
      return response
}