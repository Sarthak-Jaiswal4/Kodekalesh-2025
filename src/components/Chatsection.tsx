import React, { useEffect, useState } from 'react'
import Searchbar from './Searchbar'
import Chat from './Chat'
import { formvalues } from '@/types/formvalues'
import { Tabs } from '@radix-ui/react-tabs'
import { TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import axios from 'axios'
import { AlertCircle, Brain, CheckCircle2, FileText, Folder, History, Scale, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Textarea } from './ui/textarea'

interface ChatsectionProps {
  userquery: formvalues,
  isSearching?: boolean
  id: string
}

// Accent Color constant for inline style
const ACCENT_COLOR = "#E27D60"

function Chatsection({ userquery, id }: Partial<ChatsectionProps>) {
  const [CaseDetail, setCaseDetail] = useState<any>(null);
  const [load, setLoad] = useState<formvalues>({
    query: "",
    type: "",
    typeofmodel: ''
  });

  useEffect(() => {
    async function fetchCaseDetail() {
      try {
        const res = await axios.post("/api/CaseDetail", { caseID: id });
        if (res.data && res.data.status === 200) {
          setCaseDetail(res.data.response);
        } else {
          setCaseDetail(null);
        }
      } catch (error) {
        console.error("Failed to fetch case detail:", error);
        setCaseDetail(null);
      }
    }
    if (id) {
      fetchCaseDetail();
    }
  }, [id]);
  // Adapt fields to align with Case model schema
  const caseNumber = CaseDetail?.caseNumber || '[123456-ABC]';
  const caseTitle = CaseDetail?.caseTitle || '[Case Title]';
  const caseType = CaseDetail?.caseType || '[Type]';
  const status = CaseDetail?.status || '[Status Unknown]';
  const dateFiled = CaseDetail?.dateFiled
    ? (new Date(CaseDetail.dateFiled)).toLocaleDateString()
    : '[Date Filed Unknown]';
  const aiCaseSummary =
    CaseDetail?.aiCaseSummary ??
    'In the case of Smith v. Department of Revenue, the plaintiff contested an assessment of additional state income taxes for the 2022 tax year. The central issue involved the interpretation of Section 14(b) of the State Tax Code, specifically regarding allowable deductions for remote work expenses during the pandemic. The court found that while Smith was entitled to certain deductions for a home office, other claimed expenses—such as unreimbursed travel—did not qualify. Ultimately, the assessment was partially reduced, emphasizing the strict construction of tax deduction statutes and clarifying eligibility for taxpayers under similar circumstances.';
  const aiConflictDetector = Array.isArray(CaseDetail?.aiConflictDetector) ? CaseDetail.aiConflictDetector : [];
  const customTags: string[] = Array.isArray(CaseDetail?.customTags) ? CaseDetail.customTags : [];
  // Extract documents from schema structure
  const caseDocuments = Array.isArray(CaseDetail?.documents)
    ? CaseDetail.documents.map((doc: any, idx: number) => ({
        name: doc.title || 'Untitled Document',
        docType: doc.docType || '',
        filed: doc.dateFiled ? (new Date(doc.dateFiled)).toLocaleDateString() : '[Unknown]',
        filedBy: doc.filedBy,
        badge: idx === 0 ? <Badge variant="destructive" style={{backgroundColor: ACCENT_COLOR, color: '#fff', border: 'none'}}>New</Badge> : null, // pseudo-highlight latest
      }))
    : [];

  // Dummy fallback if no documents (matches schema fields)
  if (!caseDocuments.length) {
    caseDocuments.push(
      {
        name: "Motion to Dismiss",
        docType: "Motion",
        filed: "2024-12-10",
        filedBy: "Defense Counsel",
        badge: <Badge variant="destructive" style={{backgroundColor: ACCENT_COLOR, color: '#fff', border: 'none'}}>New</Badge>,
      },
      {
        name: "Complaint",
        docType: "Complaint",
        filed: "2024-11-15",
        filedBy: "Plaintiff Counsel",
        badge: null,
      }
    );
  }

  // Similar cases fallback
  const similarCases = [
    {
      title: "Johnson v. Metro Corp (2022)",
      description: "Similar breach of contract claim with jurisdictional issues",
      relevance: "92% Relevant",
    },
    {
      title: "State v. Williams Industries (2021)",
      description: "Force majeure defense in contract dispute",
      relevance: "87% Relevant",
    },
    {
      title: "Martinez v. Tech Solutions LLC (2020)",
      description: "Damages calculation in commercial contract cases",
      relevance: "84% Relevant",
    },
  ];

  return (
    <div className="w-full h-full flex bg-[#1a1a1a]">
      {/* Left Intelligence Pane with Tabs */}
      <div className="w-full bg-[#181818] h-full flex flex-col border-r border-[#292929] min-w-[320px] max-w-[700px] sticky top-0 overflow-y-auto px-0 py-2">
        <Tabs defaultValue="summary" className="h-full w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-[#373737] bg-[#212121] h-12 sticky top-0 z-10 px-3">
            <TabsTrigger
              value="summary"
              className="gap-2 text-[#F4F1ED] data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#E27D60] data-[state=active]:bg-[#212121]"
              style={{}}
            >
              <FileText className="h-4 w-4" color={ACCENT_COLOR} />
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="gap-2 text-[#F4F1ED] data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#E27D60] data-[state=active]:bg-[#212121]"
              style={{}}
            >
              <Brain className="h-4 w-4" color={ACCENT_COLOR} />
              Analysis
            </TabsTrigger>
            <TabsTrigger
              value="precedents"
              className="gap-2 text-[#F4F1ED] data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#E27D60] data-[state=active]:bg-[#212121]"
              style={{}}
            >
              <History className="h-4 w-4" color={ACCENT_COLOR} />
              Precedents
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="gap-2 text-[#F4F1ED] data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#E27D60] data-[state=active]:bg-[#212121]"
              style={{}}
            >
              <Folder className="h-4 w-4" color={ACCENT_COLOR} />
              Documents
            </TabsTrigger>
          </TabsList>

          <div className="p-4 space-y-4">
            <TabsContent value="summary" className="mt-0 space-y-4">
              <Card className="bg-[#242424] border-[#2c2c2c] text-[#F4F1ED]">
                <CardHeader>
                  <CardTitle className="text-base" style={{ color: ACCENT_COLOR }}>
                    Case Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-[#ABABAB] mb-1">Case Number</p>
                    <p className="text-sm font-medium">{caseNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#ABABAB] mb-1">Case Title</p>
                    <p className="text-sm font-medium">{caseTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#ABABAB] mb-1">Type</p>
                    <Badge
                      variant="outline"
                      style={{
                        backgroundColor: "#1A1A1A",
                        color: ACCENT_COLOR,
                        borderColor: ACCENT_COLOR,
                      }}
                    >
                      {caseType}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-[#ABABAB] mb-1">Status</p>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: "#232323",
                        color: "#fff",
                        borderColor: ACCENT_COLOR,
                        borderWidth: 1,
                      }}
                    >
                      {status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-[#ABABAB] mb-1">Filed On</p>
                    <p className="text-sm">{dateFiled}</p>
                  </div>
                  {!!customTags.length && (
                    <div>
                      <p className="text-xs text-[#ABABAB] mb-1">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {customTags.map((tag, i) => (
                          <Badge
                            key={tag + i}
                            variant="default"
                            style={{
                              backgroundColor: ACCENT_COLOR,
                              color: '#fff',
                              border: 'none',
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#242424] border-[#2c2c2c] text-[#F4F1ED]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4" color={ACCENT_COLOR} />
                    <span style={{ color: ACCENT_COLOR }}>AI-Generated Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{aiCaseSummary}</p>
                </CardContent>
              </Card>

              {!!aiConflictDetector.length && (
                <Card className="bg-[#242424] border-[#2c2c2c] text-[#F4F1ED]">
                  <CardHeader>
                    <CardTitle className="text-base" style={{ color: ACCENT_COLOR }}>
                      Statute or Case Conflicts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="list-disc pl-5 text-sm" style={{ color: ACCENT_COLOR }}>
                      {aiConflictDetector.map((conf: any, idx: number) => (
                        <li key={idx}>
                          <span className="font-medium">{conf.source}:</span>{" "}
                          <span>{conf.conflict}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="mt-0 space-y-4">
              <Card className="bg-[#242424] border-[#2c2c2c] text-[#F4F1ED]">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="h-4 w-4" color={ACCENT_COLOR} />
                    <span style={{ color: ACCENT_COLOR }}>AI Legal Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: ACCENT_COLOR }}>
                      <CheckCircle2 className="h-4 w-4" color={ACCENT_COLOR} />
                      Arguments for Plaintiff
                    </h4>
                    <ul className="space-y-2 text-sm ml-6">
                      <li className="list-disc">Clear contractual obligation exists (See Contract § 3.2)</li>
                      <li className="list-disc">Defendant failed to perform within stipulated timeframe</li>
                      <li className="list-disc">Damages are calculable and foreseeable (Hadley v. Baxendale)</li>
                    </ul>
                  </div>

                  <Separator className="bg-[#3a2b27]" />

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: ACCENT_COLOR }}>
                      <AlertCircle className="h-4 w-4" color={ACCENT_COLOR} />
                      Arguments for Defendant
                    </h4>
                    <ul className="space-y-2 text-sm ml-6">
                      <li className="list-disc">Force majeure clause may apply (Contract § 8.1)</li>
                      <li className="list-disc">Plaintiff failed to mitigate damages</li>
                      <li className="list-disc">Jurisdictional challenges merit consideration</li>
                    </ul>
                  </div>

                  <Separator className="bg-[#3a2b27]" />

                  <div>
                    <h4 className="text-sm font-semibold mb-2" style={{ color: ACCENT_COLOR }}>
                      Key Questions for Ruling
                    </h4>
                    <ul className="space-y-2 text-sm ml-6">
                      <li className="list-disc">Does the court have proper jurisdiction?</li>
                      <li className="list-disc">Is the force majeure clause applicable?</li>
                      <li className="list-disc">What is the appropriate measure of damages?</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* <Card className="bg-[#242424] border-[#2c2c2c] text-[#F4F1ED]">
                <CardHeader>
                  <CardTitle className="text-base" style={{ color: ACCENT_COLOR }}>
                    Drafting Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Ask AI to draft an order, ruling, or analyze a specific legal question..."
                    className="min-h-[100px] resize-none bg-[#151515] text-[#F4F1ED] border-[#282828] focus:border-[#E27D60] focus:ring-[#E27D60]"
                    style={{ backgroundColor: "#151515", color: "#F4F1ED" }}
                  />
                  <Button
                    className="w-full"
                    style={{
                      backgroundColor: ACCENT_COLOR,
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" color="#fff" />
                    Generate Draft
                  </Button>
                </CardContent>
              </Card> */}
            </TabsContent>

            <TabsContent value="precedents" className="mt-0 space-y-4">
              <Card className="bg-[#242424] border-[#2c2c2c] text-[#F4F1ED]">
                <CardHeader>
                  <CardTitle className="text-base" style={{ color: ACCENT_COLOR }}>
                    Similar Cases
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {similarCases.map((sc, idx) => (
                    <div
                      className="p-3 border border-[#363636] rounded-md hover:bg-[#232323] cursor-pointer transition-colors"
                      key={sc.title}
                    >
                      <p className="text-sm font-semibold mb-1">{sc.title}</p>
                      <p className="text-xs text-[#ABABAB] mb-2">{sc.description}</p>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ color: ACCENT_COLOR, borderColor: ACCENT_COLOR, backgroundColor: "#191919" }}
                      >
                        {sc.relevance}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-0 space-y-4">
              <Card className="bg-[#242424] border-[#2c2c2c] text-[#F4F1ED]">
                <CardHeader>
                  <CardTitle className="text-base" style={{ color: ACCENT_COLOR }}>
                    Case Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {caseDocuments.map((doc: any, idx: number) => (
                    <div
                      className="p-3 border border-[#363636] rounded-md hover:bg-[#232323] cursor-pointer transition-colors"
                      key={doc.name + '-' + idx}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" color={ACCENT_COLOR} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-[#ABABAB]">
                            Filed: {doc.filed || '[Unknown]'}
                            {doc.filedBy && <> &nbsp;by {doc.filedBy}</>}
                          </p>
                          {doc.docType && (
                            <Badge
                              variant="outline"
                              className="mt-1"
                              style={{
                                backgroundColor: "#191919",
                                color: ACCENT_COLOR,
                                borderColor: ACCENT_COLOR,
                              }}
                            >
                              {doc.docType}
                            </Badge>
                          )}
                        </div>
                        {doc.badge}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className="w-full h-full flex flex-col items-center justify-center text-[#F4F1ED] gap-2 relative bg-[#131313] min-w-[400px]">
        <Chat query={load} firstchat={userquery} className="h-full w-full pb-30 bg-[#131313]" />
        <div className="w-full h-auto fixed bottom-[-24px] z-10">
          <Searchbar className="w-full h-full" search={setLoad} />
        </div>
      </div>
    </div>
  )
}

export default Chatsection