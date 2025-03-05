'use client';

import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { RiGoogleFill } from '@remixicon/react';
import MagicLoginForm from '@/components/magic-login-form';
import { signIn } from 'next-auth/react';
import { Icons } from '@/components/icons';
import { useTheme } from 'next-themes';
import { badgeVariants } from '@/components/badge';
import { cn } from "@/lib/utils";
import LinkAIIcon from '@/components/LinkAIIcon';
import { Card } from '@/components/ui/card';

// Define the fade-in animation style
const fadeInStyle = {
  '@keyframes fadeInUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)'
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  },
  animation: 'fadeInUp 0.8s ease-out forwards'
};

const AnimatedElement = ({
  children,
  index,
  styles,
}: {
  children: React.ReactNode;
  index: number;
  styles?: React.CSSProperties;
}) => (
  <div
    style={{
      animation: 'slideUpFade 300ms ease-in-out backwards',
      animationDelay: `${index * 75}ms`,
      ...styles,
    }}
  >
    {children}
  </div>
);

const LoginForm = () => {
  const { theme, setTheme } = useTheme();

  const handleGoogleLogin = () => {
    signIn('google');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div
      className={`flex min-h-screen w-full relative ${
        theme === 'light' ? 'bg-white' : 'bg-gray-950'
      }`}
    >
      <div className="absolute left-4 top-4 md:left-8 md:top-8 flex gap-2">
        <a href="https://www.getlinkai.com/">
          <Button variant="secondary" className="flex items-center">
            <Icons.chevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
        </a>
        <Button variant="secondary" className="flex items-center" onClick={toggleTheme}>
          {theme === 'light' ? (
            <Icons.moon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Icons.sun className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
      <main className="flex-1" style={{ ...fadeInStyle, animationDelay: '100ms' }}>
        <div className="flex h-full flex-col items-center justify-center">
          <div className="w-full px-4 sm:max-w-sm sm:px-0">
            <AnimatedElement index={0}>
              <div className="space-y-1">
                <LinkAIIcon className={`h-10 w-10 pb-3 -ml-2 ${theme === 'light' ? 'text-black' : 'text-white'}`} />
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                    Welcome to Link AI
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-400 pb-6">
                    Enter your credentials to login or sign up
                  </p>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement index={1}>
              <MagicLoginForm />
            </AnimatedElement>

            <AnimatedElement index={2}>
              <Divider>or</Divider>
            </AnimatedElement>

            <AnimatedElement index={3}>
              <Button className="w-full" variant="secondary" onClick={handleGoogleLogin}>
                <span className="inline-flex items-center gap-2">
                  <RiGoogleFill className="size-4" aria-hidden="true" />
                  Login with Google
                </span>
              </Button>
            </AnimatedElement>

            <AnimatedElement index={4}>
              <div className="mt-4">
                <p className="text-xs text-gray-700 dark:text-gray-400">
                  By signing in, you agree to our{' '}
                  <a
                    href="/docs/legal/terms"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-600"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="/docs/legal/privacy"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-600"
                  >
                    Privacy Policy
                  </a>.
                </p>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </main>
      <aside
        className="hidden flex-1 overflow-hidden p-6 lg:flex items-center justify-center"
        aria-label="Product showcase"
        style={{ ...fadeInStyle, animationDelay: '300ms' }}
      >
        <Card className="relative w-full max-w-[650px] aspect-square overflow-hidden bg-gray-950 shadow-lg rounded-2xl p-0">
          <img 
            src="/login.gif" 
            alt="Link AI Login Animation"
            className="w-full h-full object-cover"
          />
        </Card>
      </aside>
    </div>
  );
};

export default LoginForm;