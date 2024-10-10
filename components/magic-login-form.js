"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import LoadingDots from "@/components/loading-dots";
import { magic } from '@/lib/magic'; // Ensure this is correctly initialized
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons'; // Import the magic wand icon

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
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="p-2 rounded-full text-white bg-gradient-to-r from-transparent to-white/10 backdrop-blur-md w-full"
          style={{
            borderRadius: '20px',
            background: 'linear-gradient(117deg, rgba(255, 255, 255, 0.00) -3.91%, rgba(255, 255, 255, 0.04) 75.27%)',
            backdropFilter: 'blur(21px)',
            border: 'none',
            position: 'relative',
            zIndex: 1,
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '2px solid transparent',
            background: 'linear-gradient(117deg, rgba(255, 255, 255, 0.00) -3.91%, rgba(255, 255, 255, 0.04) 75.27%)',
            zIndex: 0,
          }}
        ></div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center text-white p-2 rounded"
        style={{
          background: '#0075FF',
        }}
      >
        {loading ? (
          <LoadingDots color="#808080" />
        ) : (
          <>
            <FontAwesomeIcon icon={faMagicWandSparkles} className="mr-2" />
            Send Magic Link
          </>
        )}
      </button>
    </form>
  );
}