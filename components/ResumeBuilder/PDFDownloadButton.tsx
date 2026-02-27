"use client";
import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FANGPDFTemplate from "./FANGPDFTemplate";
import type { ResumeData } from "@/lib/resume-types";
import { DownloadIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  data: ResumeData;
  fileName?: string;
}

const PDFDownloadButton = ({ data, fileName = "resume.pdf" }: Props) => {
  return (
    <PDFDownloadLink
      document={<FANGPDFTemplate data={data} />}
      fileName={fileName}
    >
      {({ loading }) => (
        <Button
          className="gap-2 bg-[#47c997] hover:bg-[#3ab889] text-black font-semibold h-10 px-5 transition-all"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircleIcon className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <DownloadIcon className="w-4 h-4" />
              Download PDF
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
