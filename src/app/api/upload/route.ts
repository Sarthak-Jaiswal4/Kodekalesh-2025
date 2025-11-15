import { inngest } from "@/inngest/client";
import { Upload } from "@/lib/Producer";
import caseDetailModel from "@/models/case.model";
import { documentModel } from "@/models/document.model";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let payload: any = {};

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      payload = {
        caseNumber: formData.get("caseNumber"),
        caseTitle: formData.get("caseTitle"),
        docType: formData.get("docType"),
        filingParty: formData.get("filingParty"),
        docTitle: formData.get("docTitle"),
        accessLevel: formData.get("accessLevel"),
        judgeAction: formData.get("judgeAction"),
        respRequired: formData.get("respRequired") === "true",
        respDueDate: formData.get("respDueDate"),
        file: formData.get("file"),
        legalTopics: (() => {
          const val = formData.get("legalTopics");
          if (typeof val === "string") {
            try {
              return JSON.parse(val);
            } catch {
              return [];
            }
          }
          return [];
        })(),
      };
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }
    console.log(payload)
    if (
      !payload.caseNumber ||
      !payload.caseTitle 
    ) {
      throw new Error("Missing required caseNumber or caseTitle");
    }

    const Caseupload = await caseDetailModel.create({
      judgeId: null, // default for unassigned cases
      caseNumber: payload.caseNumber,
      caseTitle: payload.caseTitle,
      // caseType: payload.docType || undefined,
      status: "Active",
      dateFiled: new Date(),
      customTags: Array.isArray(payload.legalTopics) ? payload.legalTopics : [],
      aiCaseSummary: undefined,
      aiConflictDetector: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const uploadDocument = await documentModel.create({
      caseId: Caseupload._id,
      title: payload.docTitle,
      docType: payload.docType,
      filedBy: payload.filingParty,
      dateFiled: new Date(),
      storageUrl: "",
      accessLevel: payload.accessLevel || "Parties and Court",
    });

    await Upload(payload.file,Caseupload,uploadDocument)

    //upload the s3 public link in document

    await inngest.send({
        name:"assign/judge",
        data:{
            caseID:Caseupload._id,
            caseData:payload
        }
    })

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      { success: false, error: error?.message || error?.toString() || "Unknown error" },
      { status: 500 }
    );
  }
}
