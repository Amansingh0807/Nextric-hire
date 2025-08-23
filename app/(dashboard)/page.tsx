"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import JobInfoForm from "./_components/JobInfoForm";
import AppHighlights from "./_components/AppHighlights";
import "./animated-gradient.css"

export default function Home() {
  const { open, isMobile } = useSidebar();

  return (
    <div className="animated-gradient h-screen overflow-hidden relative">
      {/* Background Elements - Responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 sm:top-16 left-4 sm:left-16 w-24 h-24 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-8 sm:bottom-16 right-4 sm:right-16 w-32 h-32 sm:w-56 sm:h-56 lg:w-72 lg:h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-gradient-to-r from-cyan-400/5 to-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar Trigger */}
      <div className="absolute left-3 sm:left-4 top-3 sm:top-4 z-50">
        {(!open || isMobile) && (
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-1.5 sm:p-2 border border-white/20">
            <SidebarTrigger className="text-white w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>

      {/* Main Content Container - No Scroll, Fit to Screen */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center px-3 sm:px-4 lg:px-6">
        
        {/* Top Section - App Highlights */}
        <div className="w-full max-w-3xl mx-auto mb-2 sm:mb-4">
          <AppHighlights />
        </div>

        {/* Center Section - Main Content */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 lg:space-y-6 max-w-4xl mx-auto w-full">
          
          {/* Main Heading */}
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Your AI-Powered
              </span>
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Career Assistant
                </span>
                <div className="absolute -bottom-0.5 sm:-bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full"></div>
              </span>
            </h1>
            
            <p className="text-xs xs:text-sm sm:text-base md:text-lg text-white/80 max-w-xl lg:max-w-2xl leading-relaxed mx-auto px-2">
              Transform your job search with AI-powered insights, personalized CV optimization, 
              and intelligent interview preparation tools.
            </p>
          </div>

          {/* Job Input Form */}
          <div className="w-full max-w-xl lg:max-w-2xl px-2">
            <JobInfoForm />
          </div>

          {/* Feature Pills - Compact */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            <div className="backdrop-blur-md bg-white/10 rounded-full px-2 sm:px-3 py-1 border border-white/20">
              <span className="text-white/90 text-xs font-medium">✨ AI Analysis</span>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-full px-2 sm:px-3 py-1 border border-white/20">
              <span className="text-white/90 text-xs font-medium">📝 CV Optimization</span>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-full px-2 sm:px-3 py-1 border border-white/20">
              <span className="text-white/90 text-xs font-medium">🎯 Interview Prep</span>
            </div>
          </div>
        </div>

        {/* Bottom Section - Stats (Compact) */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-3 sm:gap-4 text-white/60 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span>1M+ Users</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-300"></div>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-700"></div>
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
