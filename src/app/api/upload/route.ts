import { inngest } from "@/inngest/client";
import caseDetailModel from "@/models/case.model";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface CaseDocument {
  judgeId: any;
  caseNumber: string;
  caseTitle: string;
  caseType?: 'Civil' | 'Criminal' | 'Family' | 'Appellate' | 'Probate';
  status?: 'Active' | 'Pending' | 'Stayed' | 'Closed' | 'Appealed';
  dateFiled?: Date;
  // documents?: Array<{
  //     docId?: mongoose.Types.ObjectId;
  //     title?: string;
  //     docType?: string;
  //     dateFiled?: Date;
  //     filedBy?: string;
  // }>;
  customTags?: string[];
  aiConflictDetector?: Array<{
      source?: string;
      conflict?: string;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let payload:any= {};

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Build payload from expected fields
      payload = {
        caseNumber: formData.get("caseNumber")?.toString() || "",
        caseTitle: formData.get("caseTitle")?.toString() || "",
        docType: formData.get("docType")?.toString() || "",
        filingParty: formData.get("filingParty")?.toString() || "",
        docTitle: formData.get("docTitle")?.toString() || "",
        legalTopics: (() => {
          const topics = formData.get("legalTopics");
          if (!topics) return [];
          if (typeof topics === "string") {
            try {
              // handle both CSV and JSON array
              if (topics.startsWith("[")) return JSON.parse(topics);
              return topics.split(",").map((s) => s.trim()).filter(Boolean);
            } catch (err) {
              return [];
            }
          }
          return [];
        })(),
        accessLevel: formData.get("accessLevel")?.toString() || "",
        judgeAction: formData.get("judgeAction")?.toString() || "",
        respRequired: formData.get("respRequired") === "true" || false,
        respDueDate: formData.get("respDueDate") || null,
        // file below
      };

      // Handle uploaded file if present (as Blob)
      const file = formData.get("file");
      if (file && typeof file === "object" && "arrayBuffer" in file) {
        // You may want to save the file to storage or db,
        // or pass the file buffer along to knowledge model
        payload.file = {
          name: file.name,
          type: file.type,
          size: file.size,
          // Uncomment next line to get raw data
          // data: Buffer.from(await file.arrayBuffer()),
        };
      } else {
        payload.file = null;
      }
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    // legalTopics,
    // accessLevel,
    // judgeAction,
  //   file,
    // Upload to Knowledge Model
    // Defensive validation for required fields to avoid Mongoose validation error
    console.log(payload.payload)
    if (
      !payload.payload.caseNumber ||
      !payload.payload.caseTitle
    ) {
      throw new Error("Missing required caseNumber or caseTitle");
    }

    const upload = await caseDetailModel.create({
      judgeId: null, // default for unassigned cases
      caseNumber: payload.payload.caseNumber,
      caseTitle: payload.payload.caseTitle,
      // caseType: payload.payload.docType || undefined,
      status: "Active",
      dateFiled: new Date(),
      documents: [
        {
          title: payload.payload.docTitle,
          docType: payload.payload.docType,
          dateFiled: new Date(),
          filedBy: payload.payload.filingParty,
        }
      ],
      customTags: Array.isArray(payload.payload.legalTopics) ? payload.payload.legalTopics : [],
      aiCaseSummary: undefined,
      aiConflictDetector: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(upload)

    await inngest.send({
        name:"assign/judge",
        data:{
            caseID:upload._id,
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
