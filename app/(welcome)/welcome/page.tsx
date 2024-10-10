import Link from "next/link";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons"; // Adjust the path as needed

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to the app!",
};

export default async function Welcome() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const chatbots = await db.chatbot.count({
    where: {
      userId: user.id,
    },
  });

  if (chatbots) {
    redirect("/dashboard");
  }

  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center"
      style={{
        background: "linear-gradient(159deg, #0F123B 14.25%, #090D2E 56.45%, #020515 86.14%)",
      }}
    >
      <Link
        href="/"
        className={cn(
          "absolute left-4 top-4 md:left-8 md:top-8 text-white"
        )}
      >
        <>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        className="mx-auto flex w-full max-w-4xl flex-col justify-center space-y-6"
      >
        <div className="flex flex-col space-y-2 text-center">
          <img
            src="/LINK LOGO WHITE.png"
            alt="Link AI Logo"
            className="mx-auto"
            style={{ height: '45px', width: '125px' }}
          />
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Welcome to Link On-Boarding
          </h1>
          <p className="text-sm text-white">
            Let’s get your account ready to go.
          </p>
        </div>
        <div className="relative flex items-center justify-between mb-8">
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-[#182058]"></div>
          <StepIndicator step="User Info" active />
          <StepIndicator step="Business Info" />
          <StepIndicator step="Pricing" />
          <StepIndicator step="Let's Go" />
        </div>
        <div
          className="p-8 rounded-2xl"
          style={{
            borderRadius: "20px",
            background: "linear-gradient(127deg, rgba(6, 11, 40, 0.74) 28.26%, rgba(10, 14, 35, 0.71) 91.2%)",
            backdropFilter: "blur(60px)",
          }}
        >
          <MultiStepForm />
        </div>
      </div>
    </div>
  );
}

// Multi-step form component
function MultiStepForm() {
  return (
    <form className="space-y-4 text-white">
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="First Name"
          required
          className="flex-1 p-2 rounded-lg border border-gray-300 bg-[#0F1535]"
          style={{
            borderRadius: "15px",
            border: "0.5px solid rgba(226, 232, 240, 0.30)",
          }}
        />
        <input
          type="text"
          placeholder="Last Name"
          required
          className="flex-1 p-2 rounded-lg border border-gray-300 bg-[#0F1535]"
          style={{
            borderRadius: "15px",
            border: "0.5px solid rgba(226, 232, 240, 0.30)",
          }}
        />
      </div>
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Company"
          required
          className="flex-1 p-2 rounded-lg border border-gray-300 bg-[#0F1535]"
          style={{
            borderRadius: "15px",
            border: "0.5px solid rgba(226, 232, 240, 0.30)",
          }}
        />
        <input
          type="email"
          placeholder="Email Address"
          required
          className="flex-1 p-2 rounded-lg border border-gray-300 bg-[#0F1535]"
          style={{
            borderRadius: "15px",
            border: "0.5px solid rgba(226, 232, 240, 0.30)",
          }}
        />
      </div>
      <div className="flex space-x-4">
        <input
          type="password"
          placeholder="Password"
          required
          className="flex-1 p-2 rounded-lg border border-gray-300 bg-[#0F1535]"
          style={{
            borderRadius: "15px",
            border: "0.5px solid rgba(226, 232, 240, 0.30)",
          }}
        />
        <input
          type="password"
          placeholder="Repeat Password"
          required
          className="flex-1 p-2 rounded-lg border border-gray-300 bg-[#0F1535]"
          style={{
            borderRadius: "15px",
            border: "0.5px solid rgba(226, 232, 240, 0.30)",
          }}
        />
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg">
        Next
      </button>
    </form>
  );
}

function StepIndicator({ step, active }: { step: string; active?: boolean }) {
  return (
    <div className={`relative flex-1 text-center ${active ? 'text-white' : 'text-gray-500'}`}>
      <div
        className={`w-4 h-4 mx-auto mb-1 rounded-full ${
          active ? 'bg-white' : 'bg-[#0075FF]'
        }`}
        style={{
          border: active ? 'none' : '3px solid #182058',
        }}
      ></div>
      <span>{step}</span>
    </div>
  );
}