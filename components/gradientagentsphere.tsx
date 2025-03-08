import React from "react";

// Your existing component
const GradientAgentSphere: React.FC = () => {
  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-lg">
      {/* Moving gradient background */}
      <div
  className="absolute inset-0 
             bg-gradient-to-br from-[#022597] via-[#000001] to-[#1a56db]
             bg-[length:400%_400%]
             animate-profileGradient"
/>
    </div>
  );
};

export default GradientAgentSphere;