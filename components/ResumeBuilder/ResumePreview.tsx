"use client";
import React from "react";
import type { ResumeData } from "@/lib/resume-types";

interface Props {
  data: ResumeData;
}

const HR = () => (
  <div className="border-t border-black my-1" />
);

const SectionHead = ({ title }: { title: string }) => (
  <div className="mt-3 mb-1">
    <p className="text-[9px] font-bold uppercase tracking-[1.5px]">{title}</p>
    <HR />
  </div>
);

const Bullet = ({ text }: { text: string }) => {
  if (!text.trim()) return null;
  return (
    <div className="flex gap-1.5 mb-0.5">
      <span className="mt-[1px]">•</span>
      <p className="flex-1 text-[8.5px] leading-snug">{text}</p>
    </div>
  );
};

const ResumePreview = ({ data }: Props) => {
  const contacts = [
    data.phone,
    data.email,
    data.location,
    data.linkedin ? `linkedin.com/in/${data.linkedin.replace(/^.*linkedin\.com\/in\//i, "")}` : "",
    data.github ? `github.com/${data.github.replace(/^.*github\.com\//i, "")}` : "",
  ].filter(Boolean);

  return (
    <div
      className="bg-white text-black font-[Georgia,serif] shadow-2xl"
      style={{
        width: "612px", // 8.5in at 72dpi
        minHeight: "792px",
        padding: "40px 54px",
        fontSize: "10px",
        lineHeight: "1.35",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div className="text-center mb-2">
        <p className="text-[18px] font-bold tracking-wide leading-tight font-[Arial,sans-serif]">
          {data.fullName || "Your Name"}
        </p>
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 mt-1 text-[8.5px] text-gray-700">
          {contacts.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-gray-400">|</span>}
              <span>{c}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Summary */}
      {data.summary?.trim() && (
        <>
          <SectionHead title="Summary" />
          <p className="text-[8.5px] leading-relaxed text-gray-800">{data.summary}</p>
        </>
      )}

      {/* Education */}
      {data.education?.some((e) => e.school) && (
        <>
          <SectionHead title="Education" />
          {data.education.map((edu) =>
            edu.school ? (
              <div key={edu.id} className="mb-1.5">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-[9px]">{edu.school}</span>
                    {edu.degree && (
                      <span className="text-[8.5px] italic ml-1 text-gray-600">
                        — {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                      </span>
                    )}
                  </div>
                  <div className="text-right text-[8px] text-gray-500">
                    <div>{[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}</div>
                    <div>{edu.location}</div>
                    {edu.gpa && <div>GPA: {edu.gpa}</div>}
                  </div>
                </div>
              </div>
            ) : null
          )}
        </>
      )}

      {/* Experience */}
      {data.experience?.some((e) => e.company) && (
        <>
          <SectionHead title="Experience" />
          {data.experience.map((exp) =>
            exp.company ? (
              <div key={exp.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-[9px]">{exp.company}</span>
                    {exp.role && (
                      <span className="text-[8.5px] italic ml-1 text-gray-600">{exp.role}</span>
                    )}
                  </div>
                  <div className="text-right text-[8px] text-gray-500">
                    <div>{[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}</div>
                    <div>{exp.location}</div>
                  </div>
                </div>
                <div className="mt-0.5 pl-1">
                  {exp.bullets.map((b, i) => (
                    <Bullet key={i} text={b} />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </>
      )}

      {/* Projects */}
      {data.projects?.some((p) => p.name) && (
        <>
          <SectionHead title="Projects" />
          {data.projects.map((proj) =>
            proj.name ? (
              <div key={proj.id} className="mb-2">
                <div className="flex flex-wrap items-baseline gap-x-1">
                  <span className="font-bold text-[9px]">{proj.name}</span>
                  {proj.techStack && (
                    <span className="text-[8px] italic text-gray-500">| {proj.techStack}</span>
                  )}
                  {proj.githubUrl && (
                    <span className="text-[8px] text-blue-700">
                      [GitHub{proj.liveUrl ? " | Live" : ""}]
                    </span>
                  )}
                </div>
                <div className="mt-0.5 pl-1">
                  {proj.bullets.map((b, i) => (
                    <Bullet key={i} text={b} />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </>
      )}

      {/* Skills */}
      {(data.skills?.languages ||
        data.skills?.frameworks ||
        data.skills?.tools ||
        data.skills?.databases) && (
        <>
          <SectionHead title="Technical Skills" />
          <div className="space-y-0.5">
            {data.skills.languages && (
              <div className="flex gap-1 text-[8.5px]">
                <span className="font-bold w-20 shrink-0">Languages:</span>
                <span className="text-gray-800">{data.skills.languages}</span>
              </div>
            )}
            {data.skills.frameworks && (
              <div className="flex gap-1 text-[8.5px]">
                <span className="font-bold w-20 shrink-0">Frameworks:</span>
                <span className="text-gray-800">{data.skills.frameworks}</span>
              </div>
            )}
            {data.skills.tools && (
              <div className="flex gap-1 text-[8.5px]">
                <span className="font-bold w-20 shrink-0">Tools:</span>
                <span className="text-gray-800">{data.skills.tools}</span>
              </div>
            )}
            {data.skills.databases && (
              <div className="flex gap-1 text-[8.5px]">
                <span className="font-bold w-20 shrink-0">Databases:</span>
                <span className="text-gray-800">{data.skills.databases}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ResumePreview;
