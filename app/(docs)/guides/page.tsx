// This file is causing a routing conflict with the [...slug] route
// We'll move this content to the [...slug]/page.tsx file and handle the root guides route there
// This file will be deleted after the changes are made to the other file

import { Metadata } from "next"

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1';

// Import contentlayer only if not on Vercel
let allGuides: any[] = [];
if (!isVercel) {
  try {
    const { allGuides: guides } = require("contentlayer/generated");
    allGuides = guides;
  } catch (error) {
    console.warn("ContentLayer not available:", error);
  }
}

export const metadata: Metadata = {
  title: "Guides",
  description: "Learn how to use our product with our comprehensive guides.",
}

export default async function GuidesPage() {
  // If on Vercel, show simplified version
  if (isVercel) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">Guides</h1>
        <p>Our guides are currently being updated. Please check back soon.</p>
        <p className="mt-4">
          <a href="/dashboard" className="text-blue-500 hover:underline">
            Return to Dashboard
          </a>
        </p>
      </div>
    );
  }

  // For local development, import components and render the full page
  const { PageHeader } = await import("@/components/page-header")
  const Link = (await import("next/link")).default
  const { cn } = await import("@/lib/utils")
  const { buttonVariants } = await import("@/components/ui/button")
  const { Icons } = await import("@/components/icons")

  // Sort guides by date
  const guides = allGuides
    .filter((guide) => guide.published)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <PageHeader
        heading="Guides"
        text="Learn how to use our product with our comprehensive guides."
      />
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        {guides.map((guide) => (
          <article
            key={guide._id}
            className="group relative rounded-lg border p-6 shadow-md transition-shadow hover:shadow-lg"
          >
            {guide.featured && (
              <span className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium">
                Featured
              </span>
            )}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h2 className="text-xl font-medium tracking-tight">
                  {guide.title}
                </h2>
                {guide.description && (
                  <p className="text-muted-foreground">{guide.description}</p>
                )}
              </div>
              <Link
                href={guide.slug}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-8 w-full justify-start p-0"
                )}
              >
                <Icons.arrowRight className="mr-1 h-4 w-4" />
                Read guide
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}