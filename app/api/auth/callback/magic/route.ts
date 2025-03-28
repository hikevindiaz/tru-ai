import { NextResponse } from 'next/server';
import { signIn } from 'next-auth/react';
import { authOptions } from '@/lib/auth';
import { Magic } from '@magic-sdk/admin';

// Initialize Magic Admin SDK
const magicAdmin = new Magic(process.env.MAGIC_SECRET_KEY);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const didToken = url.searchParams.get('didToken');

    if (!didToken) {
      return NextResponse.redirect(new URL('/login?error=no_token', request.url));
    }

    // Verify the DID token with Magic Admin SDK
    try {
      await magicAdmin.token.validate(didToken);
      
      // Get user metadata from the token
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      
      // Sign in with NextAuth using the verified token
      const result = await signIn('credentials', {
        didToken,
        redirect: false,
      });

      if (result?.error) {
        return NextResponse.redirect(new URL(`/login?error=${result.error}`, request.url));
      }

      // Redirect to dashboard on success
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      console.error('Token validation error:', error);
      return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
    }
  } catch (error) {
    console.error('Magic callback error:', error);
    return NextResponse.redirect(new URL('/login?error=callback_error', request.url));
  }
} 