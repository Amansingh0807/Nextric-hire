import { Sparkles } from "lucide-react";
import React from "react";

const AppHighlights = () => {
  return (
    <div className="m-[40px_auto_0] mb-[30px]">
      <div className="hidden lg:flex items-center justify-center gap-7">
        <div className="flex flex-col items-center justify-center">
          <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20">
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHighlights;