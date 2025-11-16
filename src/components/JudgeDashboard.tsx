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

// Sample data for Priority Task Inbox
const priorityTasks = [
  {
    id: 1,
    caseTitle: "State v. Johnson",
    taskDescription: "Review motion to suppress evidence",
    dueDate: "2025-11-18",
    status: "urgent",
  },
  {
    id: 2,
    caseTitle: "Martinez v. City of Springfield",
    taskDescription: "Draft preliminary injunction order",
    dueDate: "2025-11-19",
    status: "pending",
  },
  {
    id: 3,
    caseTitle: "Thompson Industries v. Roberts LLC",
    taskDescription: "Review discovery disputes",
    dueDate: "2025-11-20",
    status: "pending",
  },
  {
    id: 4,
    caseTitle: "Estate of Williams",
    taskDescription: "Approve final accounting",
    dueDate: "2025-11-17",
    status: "urgent",
  },
  {
    id: 5,
    caseTitle: "People v. Anderson",
    taskDescription: "Sentencing memorandum review",
    dueDate: "2025-11-22",
    status: "completed",
  },
];

// Sample data for Upcoming Schedule
const upcomingEvents = [
  { id: 1, time: "9:00 AM", title: "State v. Johnson - Motion Hearing", courtroom: "Courtroom 3A" },
  { id: 2, time: "11:00 AM", title: "Martinez v. Springfield - Status Conference", courtroom: "Courtroom 3A" },
  { id: 3, time: "2:00 PM", title: "Thompson v. Roberts - Settlement Conference", courtroom: "Chambers" },
  { id: 4, time: "4:00 PM", title: "Judicial Education Committee Meeting", courtroom: "Conference Room B" },
];

// Sample data for Recent Activity
const recentActivity = [
  { id: 1, time: "10 min ago", description: "New motion filed in State v. Johnson" },
  { id: 2, time: "1 hour ago", description: "Order signed in Martinez v. Springfield" },
  { id: 3, time: "2 hours ago", description: "Transcript uploaded in People v. Anderson" },
  { id: 4, time: "3 hours ago", description: "Settlement offer submitted in Thompson v. Roberts" },
  { id: 5, time: "Yesterday", description: "Hearing rescheduled in Estate of Williams" },
];

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
    const [CaseDetail, setCaseDetail] = useState<CaseDocument[]>([])
    const [ActiveCases, setActiveCases] = useState([])

    useEffect(() => {
        const getallCases=async()=>{
            const response=await axios.get("/api/getCaseDetail")
            .then((e)=>{
                setCaseDetail(e.data.response)
            }) 
            .catch((e)=>{
                console.log("error in fetching",e)
            })
        }
        getallCases()
    }, [])
    console.log(CaseDetail)

    // const ActiveCases=CaseDetail.map((case) => case.status=="Active")
  return (
    <div className="h-full w-full bg-[#1A1A1A] text-white">
      {/* Header */}
      <header className="border-b border-border text-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold">Welcome, Judge Anderson</h1>
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
              <div className="text-3xl font-bold text-white">142</div>
            </CardContent>
          </Card>

          <Card className="bg-[#242424] border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-white">Pending Motions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">28</div>
            </CardContent>
          </Card>

          <Card className="bg-[#242424] border-0 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-white">Hearings This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">5</div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Task Inbox */}
        <Card className="mb-6 bg-[#242424] text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Priority Task Inbox</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="border-0">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-white border-0">Case Title</TableHead>
                  <TableHead className="text-white border-0">Task Description</TableHead>
                  <TableHead className="text-white border-0">Due Date</TableHead>
                  <TableHead className="text-white border-0">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priorityTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-[#292929] border-0 [&>*]:!py-3">
                    <TableCell className="font-medium text-white border-0">{task.caseTitle}</TableCell>
                    <TableCell className="text-white border-0">{task.taskDescription}</TableCell>
                    <TableCell className="text-white border-0">{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="border-0">
                      <Badge
                        variant={getStatusBadgeVariant(task.status)}
                        className={
                          getStatusBadgeVariant(task.status) === "destructive"
                            ? "bg-[#E27D60] text-white border-none"
                            : getStatusBadgeVariant(task.status) === "secondary"
                            ? "bg-[#323232] text-white border-0"
                            : "bg-[#3a3a3a] text-white border-none"
                        }
                      >
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Two Column Grid - Schedule and Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Schedule */}
          <Card className="bg-[#242424] text-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex gap-4 border-b border-[#373737] pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-[70px] text-sm font-medium text-[#b0b0b0]">
                      {event.time}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{event.title}</div>
                      <div className="text-sm text-[#ababab]">{event.courtroom}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[#242424] text-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-4 border-b border-[#373737] pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-[80px] text-sm text-[#b0b0b0]">
                      {activity.time}
                    </div>
                    <div className="flex-1 text-sm text-white">
                      {activity.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
