export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  location: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  bullets: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  techStack: string;
  liveUrl?: string;
  githubUrl?: string;
  bullets: string[];
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
  summary: string;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  skills: {
    languages: string;
    frameworks: string;
    tools: string;
    databases: string;
  };
}

export const defaultResumeData: ResumeData = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  github: "",
  location: "",
  summary: "",
  education: [
    {
      id: "edu-1",
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      location: "",
    },
  ],
  experience: [
    {
      id: "exp-1",
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      location: "",
      bullets: ["", ""],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "",
      techStack: "",
      liveUrl: "",
      githubUrl: "",
      bullets: ["", ""],
    },
  ],
  skills: {
    languages: "",
    frameworks: "",
    tools: "",
    databases: "",
  },
};
