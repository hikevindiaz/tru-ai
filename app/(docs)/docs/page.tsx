import { Metadata } from "next"

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1';

// Import contentlayer only if not on Vercel
let allDocs: any[] = [];
if (!isVercel) {
  try {
    const { allDocs: docs } = require("contentlayer/generated");
    allDocs = docs;
  } catch (error) {
    console.warn("ContentLayer not available:", error);
  }
}

export const metadata: Metadata = {
  title: "Documentation",
  description: "Learn how to use our product with our comprehensive documentation.",
}

export default async function DocsPage() {
  // If on Vercel, show simplified version
  if (isVercel) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-4">Documentation</h1>
        <p>Documentation is currently being updated. Please check back soon.</p>
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

  // Get unique doc categories
  const categories = Array.from(
    new Set(allDocs.map((doc) => doc.category))
  ).sort();

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <PageHeader
        heading="Documentation"
        text="Learn how to use our product with our comprehensive documentation."
      />
      <div className="grid gap-8">
        {categories.map((category) => {
          const categoryDocs = allDocs
            .filter((doc) => doc.category === category)
            .sort((a, b) => a.title.localeCompare(b.title));

          return (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-bold">{category}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {categoryDocs.map((doc) => (
                  <Link
                    key={doc._id}
                    href={doc.slug}
                    className="group rounded-lg border p-4 hover:bg-muted"
                  >
                    <h3 className="font-medium">{doc.title}</h3>
                    {doc.description && (
                      <p className="text-sm text-muted-foreground">
                        {doc.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 