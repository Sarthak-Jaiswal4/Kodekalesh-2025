'use client'
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import axios from "axios";
import { CaseDocument } from "@/models/case.model";
import { useSession } from "next-auth/react";

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "urgent":
      return "destructive";
    case "pending":
      return "secondary";
    case "completed":
      return "default";
    default:
      return "secondary";
  }
};

const Index = () => {
  const [caseDetails, setCaseDetails] = useState<CaseDocument[]>([]);
  const { data: session } = useSession();
  const name: string =
    (session?.user?.name
      ? session.user.name.charAt(0).toUpperCase() + session.user.name.slice(1)
      : "Judge");
  console.log(name);

  useEffect(() => {
    const getAllCases = async () => {
      try {
        const response = await axios.get("/api/getCaseDetail");
        setCaseDetails(response.data.response);
      } catch (e) {
        console.log("error in fetching", e);
      }
    };
    getAllCases();
  }, []);

  const activeCases = caseDetails.filter((c) => c.status === "Active").length;
  const pendingMotions = caseDetails.reduce((count, c) => {
    if (c.status === "Pending") return count + 1;
    return count;
  }, 0);

  const startOfWeek = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  })();
  const endOfWeek = (() => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + 6);
    return d;
  })();
  const hearingsThisWeek = caseDetails.filter((c) => {
    if (c.dateFiled) {
      const filed = new Date(c.dateFiled);
      return filed >= startOfWeek && filed <= endOfWeek;
    }
    return false;
  }).length;

  return (
    <div className="h-full w-full bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="border-b border-border text-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold">{`Welcome, Judge ${name}`}</h1>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        {/* Statistics Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="bg-[#242424] border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-white">Active Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{activeCases}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#242424] border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-white">Pending Motions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{pendingMotions}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#242424] border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-white">Hearings This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{hearingsThisWeek}</div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Task Inbox (Case List) */}
        <Card className="mb-6 bg-[#242424] text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Priority Task Inbox (All Cases)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="border-0">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white border-0">Case Number</TableHead>
                  <TableHead className="text-white border-0">Case Title</TableHead>
                  <TableHead className="text-white border-0">Case Type</TableHead>
                  <TableHead className="text-white border-0">Status</TableHead>
                  <TableHead className="text-white border-0">Date Filed</TableHead>
                  <TableHead className="text-white border-0">Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {caseDetails.map((c) => (
                  <TableRow key={c.caseNumber} className="hover:bg-[#292929] border-0 [&>*]:!py-3">
                    <TableCell className="font-medium text-white border-0">{c.caseNumber}</TableCell>
                    <TableCell className="text-white border-0">{c.caseTitle}</TableCell>
                    <TableCell className="text-white border-0">{c.caseType}</TableCell>
                    <TableCell className="border-0">
                      <Badge
                        variant={
                          c.status === "Active"
                            ? "default"
                            : c.status === "Pending"
                            ? "secondary"
                            : c.status === "Stayed"
                            ? "secondary"
                            : c.status === "Closed"
                            ? "secondary"
                            : c.status === "Appealed"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          c.status === "Active"
                            ? "bg-[#3a3a3a] text-white border-none"
                            : c.status === "Pending"
                            ? "bg-[#323232] text-white border-0"
                            : c.status === "Appealed"
                            ? "bg-[#E27D60] text-white border-none"
                            : "bg-[#3a3a3a] text-white border-none"
                        }
                      >
                        {c.status || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white border-0">
                      {c.dateFiled ? new Date(c.dateFiled).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-white border-0">
                      {c.customTags && c.customTags.length > 0
                        ? c.customTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-[#373737] rounded px-2 py-0.5 mr-1 text-xs text-[#b0b0b0]"
                            >
                              {tag}
                            </span>
                          ))
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Two Column Grid - Schedule and Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Schedule (Demo, can be derived from caseDetails in future) */}
          <Card className="bg-[#242424] text-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* If you want to render hearing schedule from caseDetails, you may do so here.
                For now, this section can be adapted in the future per app requirements. */}
                {caseDetails
                  .filter((c) => !!c.dateFiled)
                  .slice(0, 4)
                  .map((c, idx) => (
                    <div
                      key={c.caseNumber || idx}
                      className="flex gap-4 border-b border-[#373737] pb-3 last:border-0 last:pb-0"
                    >
                      <div className="min-w-[100px] text-sm font-medium text-[#b0b0b0]">
                        {c.dateFiled ? new Date(c.dateFiled).toLocaleDateString() : ""}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{c.caseTitle}</div>
                        <div className="text-sm text-[#ababab]">
                          {c.caseType ? `Type: ${c.caseType}` : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                {caseDetails.length === 0 && (
                  <div className="text-[#b0b0b0] text-sm">No data available</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity (Show new/updated cases) */}
          <Card className="bg-[#242424] text-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseDetails
                  .slice(0, 5)
                  .map((c, idx) => (
                    <div
                      key={c.caseNumber || idx}
                      className="flex gap-4 border-b border-[#373737] pb-3 last:border-0 last:pb-0"
                    >
                      <div className="min-w-[120px] text-sm text-[#b0b0b0]">
                        {c.updatedAt
                          ? new Date(c.updatedAt).toLocaleString()
                          : c.createdAt
                          ? new Date(c.createdAt).toLocaleString()
                          : ""}
                      </div>
                      <div className="flex-1 text-sm text-white">
                        <span className="font-medium">{c.caseTitle}</span>
                        {c.aiCaseSummary ? (
                          <>
                            <br />
                            <span className="text-[#bcbcbe]">{c.aiCaseSummary}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))}
                {caseDetails.length === 0 && (
                  <div className="text-[#b0b0b0] text-sm">No activity found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
