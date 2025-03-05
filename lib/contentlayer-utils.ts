// This file provides fallback data when ContentLayer is not available (on Vercel)

const isVercel = process.env.VERCEL === '1';

// Fallback data for docs
export const allDocs = isVercel ? [] : [];

// Fallback data for guides
export const allGuides = isVercel ? [] : [];

// If not on Vercel, import the real data
if (!isVercel) {
  try {
    const contentlayer = require('contentlayer/generated');
    
    // Update the exports with real data
    Object.assign(exports, {
      allDocs: contentlayer.allDocs,
      allGuides: contentlayer.allGuides,
    });
  } catch (error) {
    console.warn('ContentLayer data not available:', error);
  }
}

// Helper function to get doc by slug
export function getDocBySlug(slug: string[]) {
  if (isVercel || !allDocs.length) return null;
  // Implementation would go here for non-Vercel environments
  return null;
}

// Helper function to get guide by slug
export function getGuideBySlug(slug: string[]) {
  if (isVercel || !allGuides.length) return null;
  // Implementation would go here for non-Vercel environments
  return null;
} 