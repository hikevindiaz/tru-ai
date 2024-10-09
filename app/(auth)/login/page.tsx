import Link from "next/link";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import GoogleLoginForm from "@/components/google-login-form";
import MagicLoginForm from "@/components/magic-login-form";
import Cookies from 'js-cookie';

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const didToken = await magic.auth.loginWithMagicLink({ email });
    if (didToken) {
      console.log('Login successful:', didToken);
      Cookies.set('auth_token', didToken, { expires: 1 }); // Store token in cookies
      window.location.href = '/dashboard'; // Redirect to dashboard
    }
  } catch (error) {
    console.error('Login failed:', error);
    alert(`Login failed: ${error.message || 'Please try again.'}`);
  } finally {
    setLoading(false);
  }
};

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function Login() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div
      className="flex h-screen w-screen flex-col md:flex-row"
      style={{
        background: "linear-gradient(159deg, #0F123B 14.25%, #090D2E 56.45%, #020515 86.14%)",
      }}
    >
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-cover" style={{ backgroundImage: "url('/Link AI (1).png')" }}>
        {/* Add any additional content or styling for the left side here */}
      </div>
      <div className="flex w-full md:w-1/2 flex-col justify-center items-center md:pl-16 md:pr-8"
           style={{
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
             height: '100vh', // Ensures full height for centering
           }}
      >
        <Link
          href="https://www.getlinkai.com/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "group absolute left-4 top-4 md:left-8 md:top-8 text-white"
          )}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4 text-white group-hover:text-black" />
          <span className="group-hover:text-black">Back</span>
        </Link>
        <div
          data-aos="fade-up"
          data-aos-duration="1000"
          className="flex w-full max-w-md flex-col justify-center items-center space-y-6 p-4"
        >
          <div className="flex flex-col space-y-4 text-left">
            <img 
              src="/LINK LOGO WHITE.png" 
              alt="Link AI Logo" 
              className="mb-6" 
              style={{ height: '45px', width: '125px' }}
            />
            <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome</h1>
            <p className="text-sm text-white">
              Use your email or Google account to sign in.
            </p>
            <div className="py-4 text-left space-y-4">
              <MagicLoginForm />
              <div className="flex items-center justify-center">
                <hr className="w-full border-t border-gray-300" />
                <span className="px-2 text-white">or</span>
                <hr className="w-full border-t border-gray-300" />
              </div>
              <GoogleLoginForm />
            </div>
            <p className="text-sm text-white">
              By connecting your account, you agree to our{" "}
              <a href="/docs/legal/terms" className="text-white">Terms of Service</a> and{" "}
              <a href="/docs/legal/privacy" className="text-white">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}