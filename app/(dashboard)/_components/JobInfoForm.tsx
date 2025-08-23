"use client";
import React, { useRef, useState } from "react";
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Loader, SendIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useSignInModal } from "@/hooks/use-signin-modal";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";

const JobInfoForm = () => {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { open: openSignInModal } = useSignInModal();
  const { openModal } = useUpgradeModal();

  const [jobDescription, setJobDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef<AutosizeTextAreaRef>(null);

  const createJob = useMutation(api.job.createJob);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!isSignedIn || !user) {
      openSignInModal();
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createJob({
        userId: user.id,
        jobDescription: jobDescription,
      });
      if (!response.data && response.requiresUpgrade) {
        // uggradModal hook
        openModal();
        return;
      }
      router.push(`job/${response.data}`);
    } catch (error) {
      const errorMessage =
        error instanceof ConvexError && error.data?.message
          ? error.data.message
          : "Failed to create Job";
      toast.error(errorMessage);
    }
  };
  return (
    <div className="pt-2 mb-2 z-10 mx-auto w-full max-w-2xl">
      <div className="flex flex-col border-[0.5px] border-[#646464] mx-1 sm:mx-2 md:mx-0 items-stretch transition-all duration-200 relative shadow-md rounded-xl sm:rounded-2xl bg-white border-zinc-200">
        <div className="flex flex-col gap-2 sm:gap-3 m-2 sm:m-3">
          <AutosizeTextarea
            ref={textareaRef}
            rows={2}
            maxHeight={120}
            minHeight={60}
            value={jobDescription}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSubmit(e);
              }
            }}
            placeholder="Paste Job title & description"
            className="resize-none pr-10 text-xs sm:text-sm md:text-base !border-0 font-normal !shadow-none !ring-0 focus-visible:!ring-offset-0 focus-visible:!ring-0"
          />
        </div>
        <div className="flex w-full items-center justify-end px-2 sm:px-3 py-1.5 sm:py-2">
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={isSubmitting || !jobDescription?.trim()}
            className="h-7 w-7 sm:h-8 sm:w-8"
          >
            {isSubmitting ? (
              <Loader className="w-3 h-3 animate-spin" />
            ) : (
              <SendIcon className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobInfoForm;
