"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import JobInfoForm from "./_components/JobInfoForm";
import AppHighlights from "./_components/AppHighlights";
import "./animated-gradient.css"

export default function Home() {
  const { open, isMobile } = useSidebar();

  return (
    <div className="animated-gradient min-h-screen h-screen overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/5 to-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar Trigger */}
      <div className="absolute left-6 top-6 z-50">
        {(!open || isMobile) && (
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-2 border border-white/20">
            <SidebarTrigger className="text-white" />
          </div>
        )}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        
        {/* Top Section - App Highlights */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
          <AppHighlights />
        </div>

        {/* Center Section - Main Content */}
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
          
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Your AI-Powered
              </span>
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Career Assistant
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Transform your job search with AI-powered insights, personalized CV optimization, 
              and intelligent interview preparation tools.
            </p>
          </div>

          {/* Job Input Form */}
          <div className="w-full max-w-2xl">
            <JobInfoForm />
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <div className="backdrop-blur-md bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <span className="text-white/90 text-sm font-medium">✨ AI Analysis</span>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <span className="text-white/90 text-sm font-medium">📝 CV Optimization</span>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <span className="text-white/90 text-sm font-medium">🎯 Interview Prep</span>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-full px-4 py-2 border border-white/20">
              <span className="text-white/90 text-sm font-medium">🔍 Skill Insights</span>
            </div>
          </div>
        </div>

        {/* Bottom Section - Stats or Additional Info */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-8 text-white/60 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>1M+ Job Seekers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span>AI-Powered Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
