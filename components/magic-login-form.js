"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import LoadingDots from "@/components/loading-dots";
import { magic } from '@/lib/magic'; // Ensure this is correctly initialized
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons'; // Import the magic wand icon
import { Input } from '@/components/Input'; // Import the Input component
import { Button } from '@/components/Button'; // Import the Button component
import { Label } from '@/components/Label'; // Import the Label component

export default function MagicLoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const didToken = await magic.auth.loginWithMagicLink({ email });
      if (didToken) {
        console.log('Login successful:', didToken);
        Cookies.set('auth_token', didToken, { expires: 1 }); // Store token in cookies

        // Use next-auth's signIn for consistency
        await signIn('credentials', {
          redirect: false,
          callbackUrl: searchParams?.get("from") || "/welcome",
          didToken,
        });

        window.location.href = searchParams?.get("from") || "/welcome"; // Redirect to the desired page
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(`Login failed: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-gray-900 dark:text-gray-50"
          >
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="john@company.com"
            className="mt-2"
            required
            aria-required="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="flex items-center justify-center text-white p-2 w-full"
        >
          {loading ? (
            <LoadingDots color="#808080" />
          ) : (
            <>
              <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
              Send Magic Link
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
  