"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  PlusIcon,
  Trash2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  FolderGitIcon,
  WrenchIcon,
  FileTextIcon,
} from "lucide-react";
import type {
  ResumeData,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
} from "@/lib/resume-types";

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

type SectionKey = "personal" | "education" | "experience" | "projects" | "skills" | "summary";

const sectionMeta: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
  { key: "personal", label: "Personal Info", icon: <UserIcon className="w-4 h-4" /> },
  { key: "summary", label: "Summary", icon: <FileTextIcon className="w-4 h-4" /> },
  { key: "education", label: "Education", icon: <GraduationCapIcon className="w-4 h-4" /> },
  { key: "experience", label: "Experience", icon: <BriefcaseIcon className="w-4 h-4" /> },
  { key: "projects", label: "Projects", icon: <FolderGitIcon className="w-4 h-4" /> },
  { key: "skills", label: "Technical Skills", icon: <WrenchIcon className="w-4 h-4" /> },
];

const uid = () => Math.random().toString(36).slice(2, 9);

const LabelInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="space-y-1">
    <label className="text-xs text-white/60 font-medium uppercase tracking-wider">
      {label}
    </label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-white/5 border-white/15 text-white placeholder:text-white/30 h-9 text-sm focus:border-[#47c997]/60 focus:ring-[#47c997]/20"
    />
  </div>
);

const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <div className="space-y-1">
    <label className="text-xs text-white/60 font-medium uppercase tracking-wider">
      {label}
    </label>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/15 text-white placeholder:text-white/30 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#47c997]/60 focus:ring-1 focus:ring-[#47c997]/20"
    />
  </div>
);

const BulletList = ({
  bullets,
  onChange,
  placeholder,
}: {
  bullets: string[];
  onChange: (b: string[]) => void;
  placeholder?: string;
}) => (
  <div className="space-y-2">
    <label className="text-xs text-white/60 font-medium uppercase tracking-wider">
      Bullet Points
    </label>
    {bullets.map((b, i) => (
      <div key={i} className="flex gap-2 items-center">
        <span className="text-[#47c997] text-sm">•</span>
        <Input
          value={b}
          onChange={(e) => {
            const next = [...bullets];
            next[i] = e.target.value;
            onChange(next);
          }}
          placeholder={placeholder || "Describe your achievement or contribution..."}
          className="bg-white/5 border-white/15 text-white placeholder:text-white/30 h-9 text-sm focus:border-[#47c997]/60 flex-1"
        />
        {bullets.length > 1 && (
          <button
            onClick={() => onChange(bullets.filter((_, idx) => idx !== i))}
            className="text-red-400/70 hover:text-red-400 transition-colors"
          >
            <Trash2Icon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    ))}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onChange([...bullets, ""])}
      className="text-[#47c997]/70 hover:text-[#47c997] hover:bg-[#47c997]/10 h-7 text-xs"
    >
      <PlusIcon className="w-3 h-3 mr-1" /> Add bullet
    </Button>
  </div>
);

const SectionToggle = ({
  label,
  icon,
  isOpen,
  onToggle,
}: {
  label: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 transition-all group"
  >
    <div className="flex items-center gap-2.5 text-white/80 group-hover:text-white text-sm font-medium">
      <span className="text-[#47c997]">{icon}</span>
      {label}
    </div>
    {isOpen ? (
      <ChevronUpIcon className="w-4 h-4 text-white/40" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 text-white/40" />
    )}
  </button>
);

const ResumeForm = ({ data, onChange }: Props) => {
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    personal: true,
    summary: false,
    education: false,
    experience: false,
    projects: false,
    skills: false,
  });

  const toggle = (key: SectionKey) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const set = (partial: Partial<ResumeData>) => onChange({ ...data, ...partial });

  // Education
  const addEdu = () =>
    set({
      education: [
        ...data.education,
        { id: uid(), school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", location: "" },
      ],
    });
  const removeEdu = (id: string) =>
    set({ education: data.education.filter((e) => e.id !== id) });
  const updateEdu = (id: string, patch: Partial<ResumeEducation>) =>
    set({ education: data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) });

  // Experience
  const addExp = () =>
    set({
      experience: [
        ...data.experience,
        { id: uid(), company: "", role: "", startDate: "", endDate: "", location: "", bullets: [""] },
      ],
    });
  const removeExp = (id: string) =>
    set({ experience: data.experience.filter((e) => e.id !== id) });
  const updateExp = (id: string, patch: Partial<ResumeExperience>) =>
    set({ experience: data.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });

  // Projects
  const addProj = () =>
    set({
      projects: [
        ...data.projects,
        { id: uid(), name: "", techStack: "", liveUrl: "", githubUrl: "", bullets: [""] },
      ],
    });
  const removeProj = (id: string) =>
    set({ projects: data.projects.filter((p) => p.id !== id) });
  const updateProj = (id: string, patch: Partial<ResumeProject>) =>
    set({ projects: data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

  return (
    <div className="space-y-3">
      {sectionMeta.map(({ key, label, icon }) => (
        <div key={key}>
          <SectionToggle
            label={label}
            icon={icon}
            isOpen={openSections[key]}
            onToggle={() => toggle(key)}
          />

          {openSections[key] && (
            <div className="mt-2 px-4 pt-4 pb-5 rounded-xl border border-white/10 bg-white/[0.03] space-y-4">
              {/* ── Personal ── */}
              {key === "personal" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <LabelInput label="Full Name" value={data.fullName} onChange={(v) => set({ fullName: v })} placeholder="e.g. Rahul Sharma" />
                    <LabelInput label="Email" value={data.email} onChange={(v) => set({ email: v })} placeholder="rahul@email.com" type="email" />
                    <LabelInput label="Phone" value={data.phone} onChange={(v) => set({ phone: v })} placeholder="+91 98765 43210" />
                    <LabelInput label="Location" value={data.location} onChange={(v) => set({ location: v })} placeholder="Bengaluru, IN" />
                    <LabelInput label="LinkedIn URL/Username" value={data.linkedin} onChange={(v) => set({ linkedin: v })} placeholder="linkedin.com/in/rahul" />
                    <LabelInput label="GitHub URL/Username" value={data.github} onChange={(v) => set({ github: v })} placeholder="github.com/rahul" />
                  </div>
                </>
              )}

              {/* ── Summary ── */}
              {key === "summary" && (
                <TextArea
                  label="Professional Summary (2–3 sentences)"
                  value={data.summary}
                  onChange={(v) => set({ summary: v })}
                  placeholder="Results-driven software engineer with 3+ years of experience building scalable distributed systems..."
                  rows={4}
                />
              )}

              {/* ── Education ── */}
              {key === "education" && (
                <>
                  {data.education.map((edu, idx) => (
                    <div key={edu.id} className="space-y-3 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#47c997] font-semibold">Education #{idx + 1}</span>
                        {data.education.length > 1 && (
                          <button onClick={() => removeEdu(edu.id)} className="text-red-400/60 hover:text-red-400">
                            <Trash2Icon className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LabelInput label="School / University" value={edu.school} onChange={(v) => updateEdu(edu.id, { school: v })} placeholder="IIT Delhi" />
                        <LabelInput label="Location" value={edu.location} onChange={(v) => updateEdu(edu.id, { location: v })} placeholder="New Delhi, IN" />
                        <LabelInput label="Degree" value={edu.degree} onChange={(v) => updateEdu(edu.id, { degree: v })} placeholder="B.Tech / M.Tech / B.Sc" />
                        <LabelInput label="Field of Study" value={edu.field} onChange={(v) => updateEdu(edu.id, { field: v })} placeholder="Computer Science" />
                        <LabelInput label="Start Date" value={edu.startDate} onChange={(v) => updateEdu(edu.id, { startDate: v })} placeholder="Aug 2020" />
                        <LabelInput label="End Date" value={edu.endDate} onChange={(v) => updateEdu(edu.id, { endDate: v })} placeholder="May 2024 or Present" />
                        <LabelInput label="GPA (optional)" value={edu.gpa || ""} onChange={(v) => updateEdu(edu.id, { gpa: v })} placeholder="9.2/10 or 3.8/4.0" />
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={addEdu} className="text-[#47c997]/70 hover:text-[#47c997] hover:bg-[#47c997]/10 h-8 text-xs">
                    <PlusIcon className="w-3 h-3 mr-1" /> Add Education
                  </Button>
                </>
              )}

              {/* ── Experience ── */}
              {key === "experience" && (
                <>
                  {data.experience.map((exp, idx) => (
                    <div key={exp.id} className="space-y-3 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#47c997] font-semibold">Experience #{idx + 1}</span>
                        {data.experience.length > 1 && (
                          <button onClick={() => removeExp(exp.id)} className="text-red-400/60 hover:text-red-400">
                            <Trash2Icon className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LabelInput label="Company" value={exp.company} onChange={(v) => updateExp(exp.id, { company: v })} placeholder="Google" />
                        <LabelInput label="Job Title / Role" value={exp.role} onChange={(v) => updateExp(exp.id, { role: v })} placeholder="Software Engineer" />
                        <LabelInput label="Start Date" value={exp.startDate} onChange={(v) => updateExp(exp.id, { startDate: v })} placeholder="Jun 2022" />
                        <LabelInput label="End Date" value={exp.endDate} onChange={(v) => updateExp(exp.id, { endDate: v })} placeholder="Present" />
                        <LabelInput label="Location" value={exp.location} onChange={(v) => updateExp(exp.id, { location: v })} placeholder="Mountain View, CA" />
                      </div>
                      <BulletList
                        bullets={exp.bullets}
                        onChange={(bullets) => updateExp(exp.id, { bullets })}
                        placeholder="Built a microservice that reduced p99 latency by 40%..."
                      />
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={addExp} className="text-[#47c997]/70 hover:text-[#47c997] hover:bg-[#47c997]/10 h-8 text-xs">
                    <PlusIcon className="w-3 h-3 mr-1" /> Add Experience
                  </Button>
                </>
              )}

              {/* ── Projects ── */}
              {key === "projects" && (
                <>
                  {data.projects.map((proj, idx) => (
                    <div key={proj.id} className="space-y-3 pb-4 border-b border-white/10 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#47c997] font-semibold">Project #{idx + 1}</span>
                        {data.projects.length > 1 && (
                          <button onClick={() => removeProj(proj.id)} className="text-red-400/60 hover:text-red-400">
                            <Trash2Icon className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <LabelInput label="Project Name" value={proj.name} onChange={(v) => updateProj(proj.id, { name: v })} placeholder="NextricHire AI" />
                        <LabelInput label="Tech Stack" value={proj.techStack} onChange={(v) => updateProj(proj.id, { techStack: v })} placeholder="Next.js, TypeScript, Convex" />
                        <LabelInput label="GitHub URL" value={proj.githubUrl || ""} onChange={(v) => updateProj(proj.id, { githubUrl: v })} placeholder="https://github.com/..." />
                        <LabelInput label="Live URL (optional)" value={proj.liveUrl || ""} onChange={(v) => updateProj(proj.id, { liveUrl: v })} placeholder="https://..." />
                      </div>
                      <BulletList
                        bullets={proj.bullets}
                        onChange={(bullets) => updateProj(proj.id, { bullets })}
                        placeholder="Developed a real-time AI pipeline processing 10K+ requests/day..."
                      />
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={addProj} className="text-[#47c997]/70 hover:text-[#47c997] hover:bg-[#47c997]/10 h-8 text-xs">
                    <PlusIcon className="w-3 h-3 mr-1" /> Add Project
                  </Button>
                </>
              )}

              {/* ── Skills ── */}
              {key === "skills" && (
                <div className="grid grid-cols-1 gap-3">
                  <LabelInput label="Languages" value={data.skills.languages} onChange={(v) => set({ skills: { ...data.skills, languages: v } })} placeholder="JavaScript, TypeScript, Python, Java, C++" />
                  <LabelInput label="Frameworks / Libraries" value={data.skills.frameworks} onChange={(v) => set({ skills: { ...data.skills, frameworks: v } })} placeholder="React, Next.js, Node.js, Express, TensorFlow" />
                  <LabelInput label="Tools & Platforms" value={data.skills.tools} onChange={(v) => set({ skills: { ...data.skills, tools: v } })} placeholder="Git, Docker, Kubernetes, AWS, CI/CD" />
                  <LabelInput label="Databases" value={data.skills.databases} onChange={(v) => set({ skills: { ...data.skills, databases: v } })} placeholder="PostgreSQL, MongoDB, Redis, Elasticsearch" />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ResumeForm;
