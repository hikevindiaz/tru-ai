import React from "react";
import Image from "next/image";

// Your existing component
const LinkAIProfileIcon: React.FC = () => {
  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-lg">
      {/* Moving gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#022597] via-[#000001] to-[#1a56db] bg-[length:200%_200%] animate-profileGradient" />
      
      {/* Link AI Logo on top */}
      <Image
        src="/LINK AI ICON WHITE.png"  // Ensure this path is correct
        alt="Link AI Logo"
        fill // Use fill instead of layout="fill"
        className="p-2 object-contain" // Use CSS for object fitting
      />
    </div>
  );
};

export default LinkAIProfileIcon;