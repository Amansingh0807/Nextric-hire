import { Sparkles } from "lucide-react";
import React from "react";

const AppHighlights = () => {
  return (
    <div className="w-full flex justify-center mb-2 sm:mb-3">
      <div className="flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/10 rounded-lg p-2 sm:p-3 border border-white/20">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default AppHighlights;