import { NextResponse } from "next/server";
import DBconnection from "@/lib/Connection";
import caseDetailModel from "@/models/case.model";

await DBconnection();

export async function POST(request: Request) {
  try {
    const { caseID } = await request.json();
    console.log(caseID)
    if (!caseID) {
      return NextResponse.json({
        status: 400,
        response: "No caseID provided",
      });
    }

    const caseDetail = await caseDetailModel.findById( caseID );
    console.log(caseDetail)
    if (!caseDetail) {
      return NextResponse.json({
        status: 404,
        response: "Case not found",
      });
    }

    return NextResponse.json({
      status: 200,
      response: caseDetail,
    });
  } catch (error) {
    console.error("Error fetching case detail:", error);
    return NextResponse.json({
      status: 500,
      response: "Internal server error",
    });
  }
}
