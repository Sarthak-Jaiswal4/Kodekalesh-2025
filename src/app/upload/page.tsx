"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { Upload } from "@/lib/Producer";

function TagInput({
  tags,
  setTags,
  placeholder,
  exampleTags,
}: {
  tags: string[];
  setTags: (t: string[]) => void;
  placeholder?: string;
  exampleTags?: string[];
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const newInput = input.trim();
      if (!tags.includes(newInput)) setTags([...tags, newInput]);
      setInput("");
    } else if (e.key === "Backspace" && !input && tags.length) {
      setTags(tags.slice(0, tags.length - 1));
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const textList = e.clipboardData
      .getData("text")
      .split(/,|\n/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (textList.length > 1) {
      e.preventDefault();
      const newTags = [...tags];
      for (let text of textList)
        if (!newTags.includes(text)) newTags.push(text);
      setTags(newTags);
      setInput("");
    }
  }

  return (
    <div>
      <div
        className={cn(
          "flex flex-wrap gap-1 px-2 py-1 rounded-md min-h-[40px]",
          "border border-[#232635] bg-[#16181d]", // dark border and dark background
          "focus-within:ring-2 focus-within:ring-[#E27D60]/60"
        )}
        style={{
          color: "#F4F1ED", // main text light
        }}
        aria-label="Legal issue topics tag input"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded px-2 py-1 text-xs"
            style={{
              background: "#232635", // dark chip
              color: "#E27D60", // accent tag text
            }}
          >
            {tag}
            <button
              type="button"
              className="ml-1"
              aria-label={`Remove topic ${tag}`}
              onClick={() =>
                setTags(tags.filter((_, j) => i !== j))
              }
              tabIndex={-1}
              style={{
                color: "#A6A6A6", // muted close button
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.05em",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent focus:outline-none px-1 py-1 min-w-[110px]"
          style={{
            color: "#F4F1ED", // typing appears light
            background: "transparent",
            border: "none",
          }}
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          aria-label="Add tag"
        />
      </div>
      {!!exampleTags?.length && (
        <div className="text-xs mt-1 px-2 py-1" style={{ color: "#E5E2DC" }}>
          <span className="font-medium pr-1" style={{ color: "#E27D60" }}>
            Examples:
          </span>{" "}
          {exampleTags.map((t) => (
            <span
              key={t}
              className="inline-block mr-2 mb-2"
              style={{
                background: "#232635",
                color: "#80B3FF",
                padding: "2px 8px",
                borderRadius: "8px",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const documentTypes = [
  "Motion to Dismiss",
  "Motion for Summary Judgment",
  "Expert Witness Report",
  "Exhibit",
  "Notice of Appearance",
  "Proposed Order",
];

const judgeActions = [
  { value: "ruling", label: "Ruling Required (High Priority)" },
  { value: "signature", label: "Signature Required" },
  { value: "hearing", label: "Hearing Requested" },
  { value: "response", label: "Response from Opposing Party" },
  { value: "info", label: "For Information / Filing Only (Low Priority)" },
];

const accessOptions = [
  { value: "public", label: "Public" },
  { value: "parties", label: "Parties and Court Only" },
  { value: "sealed", label: "Sealed (Judge Only)" }
];

// For demo: we'll allow manual entry of case number and title
export default function UploadPage() {
  const [caseNumber, setCaseNumber] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [docType, setDocType] = useState("");
  const [filingParty, setFilingParty] = useState("");
  const [filingOptions, setFilingOptions] = useState<any[]>([
    "Plaintiff", "Defendant", "Counsel", "Other"
  ]);
  const [docTitle, setDocTitle] = useState("");
  const [file, setFile] = useState<File | undefined>(null);

  const [legalTopics, setLegalTopics] = useState<string[]>([]);
//   const [summary, setSummary] = useState(""); /// get from LLM
  const [accessLevel, setAccessLevel] = useState("");

  const [judgeAction, setJudgeAction] = useState("");
  const [respRequired, setRespRequired] = useState(false);
  const [respDueDate, setRespDueDate] = useState<Date | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [fileURL, setfileURL] = useState<string | undefined>(undefined)

  const InputFile=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const File=e.target?.files?.[0]
    console.log(File)
    setFile(File)
    if(File){
      const url=URL.createObjectURL(File)
      console.log(url)
      setfileURL(url)
      await Upload(File)
      console.log('File uploaded successfully')
    }else{
      setfileURL(undefined)
    }
  }

  useEffect(() => {
    if (file && file.name) {
      setDocTitle(file.name);
    }
  }, [file]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Construct payload
    const payload: any = {
      caseNumber,
      caseTitle,
      docType,
      filingParty,
      docTitle,
      legalTopics,
      accessLevel,
      judgeAction,
      respRequired,
      respDueDate: respRequired && respDueDate ? respDueDate : null,
    //   file,
    };
    // Submit to backend
    const response=await axios.post("/api/upload",{payload})
    .then((e)=>{
        console.log(e.data)
    })
    .catch((e)=>{
        console.log("error",e)
    })
    .finally(() => {
        setSubmitting(false)
    })

  };

  return (
    <div className="w-full min-h-screen bg-[#1A1A1A]" style={{ color: "#F4F1ED" }}>
        <div className="max-w-xl mx-auto py-12 px-4 space-y-10 bg-[#1A1A1A] rounded-3xl shadow-2xl border border-[#33363b]">
        <h1 className="text-3xl font-black text-center bg-gradient-to-r from-blue-400 to-[#E27D60] text-transparent bg-clip-text tracking-tight drop-shadow">
            <span className="flex items-center justify-center gap-2">
            {/* <CalendarIcon className="inline mr-1 w-7 h-7 text-blue-400" /> */}
            Upload Case Document
            </span>
        </h1>
        <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Case Number Field */}
            <div>
            <Label className="block mb-2 font-semibold" style={{ color: "#F4F1ED" }}>Case Number <span className="text-[#E27D60]">(The Primary Key)</span></Label>
            <Input
                className="bg-[#181b20] border border-[#292d35] rounded-lg focus:ring-2 focus:ring-blue-500/70 h-12 text-base"
                style={{ color: "#F4F1ED"}}
                type="text"
                placeholder="Enter case number (e.g. 2023-CV-001)"
                value={caseNumber}
                onChange={e => setCaseNumber(e.target.value)}
                autoComplete="off"
                required
            />
            </div>
            {/* Case Title Field */}
            <div>
            <Label className="block mb-2 font-semibold" style={{ color: "#F4F1ED" }}>Case Title</Label>
            <Input
                className="bg-[#181b20] border border-[#292d35] rounded-lg focus:ring-2 focus:ring-blue-500/70 h-12 text-base"
                style={{ color: "#F4F1ED" }}
                type="text"
                placeholder="E.g. Smith v. Doe"
                value={caseTitle}
                onChange={e => setCaseTitle(e.target.value)}
                autoComplete="off"
                required
            />
            </div>
            <fieldset className="space-y-8">
            {/* Document Type Dropdown */}
            <div>
                <Label className="font-semibold" style={{ color: "#F4F1ED" }}>Document Type</Label>
                <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger className="mt-2 bg-[#181b20] border border-[#292d35] rounded-lg focus:ring-2 focus:ring-[#E27D60]/60 focus:border-blue-400 h-12 text-base" style={{ color: "#F4F1ED" }}>
                    <SelectValue placeholder="Choose document type..." />
                </SelectTrigger>
                <SelectContent className="bg-[#181b20] border border-[#292d35] rounded-lg" style={{ color: "#F4F1ED" }}>
                    {documentTypes.map((dt) => (
                    <SelectItem
                        key={dt}
                        value={dt}
                        className="hover:bg-[#E27D60]/50 cursor-pointer h-12 text-base flex items-center"
                    >{dt}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            {/* Filing Party */}
            <div>
                <Label className="font-semibold" style={{ color: "#F4F1ED" }}>Filing Party</Label>
                <Select value={filingParty} onValueChange={setFilingParty}>
                <SelectTrigger className="mt-2 bg-[#181b20] border border-[#292d35] rounded-lg focus:ring-2 focus:ring-blue-500/80 focus:border-blue-500 h-12 text-base" style={{ color: "#F4F1ED" }}>
                    <SelectValue placeholder="Select Filing Party..." />
                </SelectTrigger>
                <SelectContent className="bg-[#181b20] border border-[#292d35] rounded-lg" style={{ color: "#F4F1ED" }}>
                    {filingOptions.map((op: any) =>
                    <SelectItem
                        key={op}
                        value={op}
                        className="hover:bg-blue-500/20 cursor-pointer h-12 text-base flex items-center"
                    >{op}</SelectItem>
                    )}
                </SelectContent>
                </Select>
            </div>
            
            {/* File input & Document Title */}
            <div>
                <Label className="font-semibold" style={{ color: "#F4F1ED" }}>Document PDF</Label>
                <Input
                className="bg-[#181b20] border border-[#292d35] rounded-lg file:bg-blue-600 flex items-center file:text-white file:rounded-md file:border-none file:py-3 file:px-4 h-12 text-base"
                style={{ color: "#F4F1ED" }}
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  InputFile(e)
                }}
                />
            </div>
            <div>
                <Label className="font-semibold flex items-center gap-2 pb-2" style={{ color: "#F4F1ED" }}>
                Document Title (Friendly Name)
                <span className="ml-1 text-xs text-blue-400">
                    (prefilled from file but editable)
                </span>
                </Label>
                <Input
                className="bg-[#181b20] border border-[#292d35] rounded-lg focus:ring-2 focus:ring-blue-500/70 h-12 text-base"
                style={{ color: "#F4F1ED" }}
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Enter Document Title"
                autoComplete="off"
                />
            </div>

            {/* Key Legal Issues / Topics */}
            <div>
                <Label className="font-semibold flex items-center gap-2 pb-2" style={{ color: "#F4F1ED" }}>
                Key Legal Issues / Topics
                <span className="ml-1 text-xs" style={{ color: "#E27D60" }}>(for semantic search accuracy)</span>
                </Label>
                <TagInput
                tags={legalTopics}
                setTags={setLegalTopics}
                placeholder="Add topics (e.g. Admissibility of Evidence)..."
                exampleTags={[
                    "Statute of Limitations",
                    "Admissibility of Evidence",
                    "Contract Breach",
                    "IPC Sec. 302"
                ]}
                />
            </div>

            {/* Plain Language Summary of Request */}
            {/* <div>
                <Label style={{ color: "#F4F1ED" }}>
                Plain Language Summary of Request
                <span className="ml-2 text-xs text-muted-foreground">
                    (1-2 sentences &mdash; shown to judge instantly)
                </span>
                </Label>
                <textarea
                className="w-full border px-3 py-4 rounded mt-1 min-h-[64px] leading-snug resize-vertical focus:ring-2 focus:ring-ring text-base"
                style={{ color: "#F4F1ED" }}
                placeholder='E.g. "We are asking the court to dismiss counts 2 and 3 of the complaint because the statute of limitations has expired."'
                value={summary}
                onChange={e => setSummary(e.target.value)}
                maxLength={400}
                name="plainSummary"
                />
            </div> */}

            {/* Access & Confidentiality */}
            <div>
                <Label className="font-semibold" style={{ color: "#F4F1ED" }}>Access &amp; Confidentiality</Label>
                <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger className="mt-2 bg-[#181b20] border border-[#292d35] rounded-lg focus:ring-2 focus:ring-[#E27D60]/60 focus:border-[#E27D60] h-12 text-base" style={{ color: "#F4F1ED" }}>
                    <SelectValue placeholder="Who can view this document?" />
                </SelectTrigger>
                <SelectContent className="bg-[#181b20] border border-[#292d35] rounded-lg" style={{ color: "#F4F1ED" }}>
                    {accessOptions.map(opt => (
                    <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="hover:bg-[#E27D60]/40 cursor-pointer h-12 text-base flex items-center"
                    >
                        {opt.label}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            {/* Action Requested from Judge */}
            <div>
                <Label className="font-semibold" style={{ color: "#F4F1ED" }}>Action Requested from Judge</Label>
                <Select value={judgeAction} onValueChange={setJudgeAction}>
                <SelectTrigger className="mt-2 bg-[#181b20] border border-[#292d35] rounded-lg focus:ring-2 focus:ring-blue-500/70 h-12 text-base" style={{ color: "#F4F1ED" }}>
                    <SelectValue placeholder="Select Judge Action..." />
                </SelectTrigger>
                <SelectContent className="bg-[#181b20] border border-[#292d35] rounded-lg" style={{ color: "#F4F1ED" }}>
                    {judgeActions.map((j) => (
                    <SelectItem
                        key={j.value}
                        value={j.value}
                        className="hover:bg-blue-500/20 cursor-pointer h-12 text-base flex items-center"
                    >{j.label}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            {/* Response Required Toggle */}
            <div className="flex items-center gap-5 py-2">
                <Label htmlFor="resp-required" className="font-semibold" style={{ color: "#F4F1ED" }}>Is Response Required from Opposing Party?</Label>
                <Switch
                id="resp-required"
                checked={respRequired}
                onCheckedChange={setRespRequired}
                className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-700 h-7 w-12"
                />
            </div>

            {/* Due Date (if response required) */}
            {respRequired && (
                <div>
                <Label className="font-semibold" style={{ color: "#F4F1ED" }}>Response Due Date</Label>
                <div>
                    <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-medium mt-2 rounded-lg bg-[#181c21] border border-blue-600/50 hover:bg-blue-800/40 text-blue-200 shadow transition h-12 text-base",
                        !respDueDate && "text-[#E27D60]"
                    )}
                    type="button"
                    style={{ color: "#F4F1ED" }}
                    onClick={() => {
                        // Could trigger popover if desired
                    }}
                    >
                    <CalendarIcon className="mr-2 h-5 w-5" style={{ color: "#E27D60" }} />
                    {respDueDate ? format(respDueDate, "PPP") : "Pick a date"}
                    </Button>
                    <div className="mt-3 rounded-xl overflow-hidden border border-[#232635] shadow-inner bg-[#16181d]">
                    <Calendar
                        mode="single"
                        selected={respDueDate}
                        onSelect={setRespDueDate}
                        initialFocus
                    />
                    </div>
                </div>
                </div>
            )}

            {/* Submit Button */}
            <div>
                <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-[#E27D60] hover:from-blue-700 hover:to-[#E27D60] text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 text-lg"
                style={{ color: "#F4F1ED" }}
                disabled={submitting}
                >
                {submitting ?
                    (<span className="flex items-center gap-3" style={{ color: "#F4F1ED" }}>
                    <Loader2 className="animate-spin text-white" size={20} />
                    <span>Uploading...</span>
                    </span>)
                    : (<span className="flex items-center gap-2" style={{ color: "#F4F1ED" }}>
                        <CalendarIcon className="inline w-5 h-5" />
                        Upload Document
                    </span>)
                }
                </Button>
            </div>
            </fieldset>
        </form>
        </div>
    </div>
  );
}
