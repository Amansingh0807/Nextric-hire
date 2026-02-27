"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import ResumeForm from "@/components/ResumeBuilder/ResumeForm";
import ResumePreview from "@/components/ResumeBuilder/ResumePreview";
import { defaultResumeData, type ResumeData } from "@/lib/resume-types";
import { DownloadIcon, EyeIcon, PencilIcon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComponentType } from "react";

interface PDFButtonProps {
  data: ResumeData;
  fileName?: string;
}

// Dynamic import to avoid SSR issues with @react-pdf/renderer
const PDFDownloadButton = dynamic<PDFButtonProps>(
  () => import("@/components/ResumeBuilder/PDFDownloadButton"),
  {
    ssr: false,
    loading: () => (
      <Button
        disabled
        className="gap-2 bg-[#47c997] hover:bg-[#3ab889] text-black font-semibold h-10 px-5"
      >
        <DownloadIcon className="w-4 h-4" />
        Preparing PDF...
      </Button>
    ),
  }
) as ComponentType<PDFButtonProps>;

type Tab = "form" | "preview";

export default function ResumeBuilderPage() {
  const { open, isMobile } = useSidebar();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [activeTab, setActiveTab] = useState<Tab>("form");

  return (
    <div className="min-h-screen bg-[rgb(18,18,18)] text-white">
      {/* Sidebar trigger */}
      <div className="fixed left-3 top-3 z-50">
        {(!open || isMobile) && (
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-1.5 border border-white/20">
            <SidebarTrigger className="text-white w-4 h-4" />
          </div>
        )}
      </div>

      {/* Top Header */}
      <div className="border-b border-white/10 bg-[rgb(22,22,22)] sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#47c997]/15 flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-[#47c997]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Resume Builder</h1>
              <p className="text-xs text-white/40">FAANG-style ATS-friendly template</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile tab toggle */}
            <div className="flex lg:hidden backdrop-blur-md bg-white/10 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setActiveTab("form")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === "form"
                    ? "bg-white/15 text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <PencilIcon className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === "preview"
                    ? "bg-white/15 text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                <EyeIcon className="w-3 h-3" />
                Preview
              </button>
            </div>

            <PDFDownloadButton
              data={resumeData}
              fileName={`${resumeData.fullName.replace(/\s+/g, "_") || "resume"}_FAANG.pdf`}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
          {/* LEFT: Form Panel */}
          <div
            className={`lg:w-[420px] xl:w-[460px] shrink-0 border-r border-white/10 ${
              activeTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="p-4 sm:p-6 space-y-1">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-white/70">Fill in your details</h2>
                <p className="text-xs text-white/40 mt-0.5">
                  Use strong action verbs and quantified achievements for best results
                </p>
              </div>
              <ResumeForm data={resumeData} onChange={setResumeData} />
            </div>
          </div>

          {/* RIGHT: Preview Panel */}
          <div
            className={`flex-1 ${
              activeTab === "form" ? "hidden lg:flex" : "flex"
            } flex-col items-center`}
          >
            <div className="sticky top-[64px] w-full">
              <div className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[rgb(20,20,20)]">
                <div className="flex items-center gap-2">
                  <EyeIcon className="w-4 h-4 text-[#47c997]" />
                  <span className="text-sm text-white/70 font-medium">Live Preview</span>
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">FAANG Template</span>
                </div>
                <span className="text-xs text-white/30">Letter size (8.5 × 11 in)</span>
              </div>
            </div>

            <div
              className="flex-1 overflow-auto p-4 sm:p-8"
              style={{ background: "repeating-linear-gradient(45deg, rgba(255,255,255,.015) 0px, rgba(255,255,255,.015) 1px, transparent 1px, transparent 16px)" }}
            >
              <div className="flex justify-center">
                <div className="origin-top-left" style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
                  <ResumePreview data={resumeData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
