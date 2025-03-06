import { notFound } from "next/navigation"
import "@/styles/mdx.css"
import { Metadata } from "next"
import { absoluteUrl, getSafeGitHubConfig } from "@/lib/utils"

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1';

// Import contentlayer only if not on Vercel
let allDocs: any[] = [];
if (!isVercel) {
  try {
    // Use dynamic import with require to avoid build errors
    const contentlayer = require("contentlayer/generated");
    allDocs = contentlayer.allDocs || [];
  } catch (error) {
    console.warn("ContentLayer not available:", error);
    allDocs = [];
  }
} else {
  // On Vercel, use empty array
  allDocs = [];
}

interface DocPageProps {
    params: {
        slug?: string[]
    }
}

async function getDocFromParams(params: any) {
    if (isVercel) return null;
    
    const slug = params.slug?.join("/") || ""
    const doc = allDocs.find((doc: any) => doc.slugAsParams === slug)

    if (!doc) {
        return null
    }

    return doc
}

export async function generateMetadata({
    params,
}: DocPageProps): Promise<Metadata> {
    // If this is the index page
    if (!params.slug || params.slug.length === 0) {
        return {
            title: "Documentation",
            description: "Learn how to use our product with our comprehensive documentation.",
        }
    }

    const doc = await getDocFromParams(params)

    if (!doc) {
        return {}
    }

    const url = process.env.NEXT_PUBLIC_VERCEL_URL

    const ogUrl = new URL(`${url}/api/og`)
    ogUrl.searchParams.set("heading", doc.description ?? doc.title)
    ogUrl.searchParams.set("type", "Documentation")
    ogUrl.searchParams.set("mode", "dark")

    return {
        title: doc.title,
        description: doc.description,
        openGraph: {
            title: doc.title,
            description: doc.description,
            type: "article",
            url: absoluteUrl(doc.slug),
            images: [
                {
                    url: ogUrl.toString(),
                    width: 1200,
                    height: 630,
                    alt: doc.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: doc.title,
            description: doc.description,
            images: [ogUrl.toString()],
        },
    }
}

export async function generateStaticParams(): Promise<
    DocPageProps["params"][]
> {
    if (isVercel) return [{ slug: [] }];
    
    // Include the root docs page
    const paths = [{ slug: [] }];
    
    // Add all the individual doc pages
    allDocs.forEach((doc) => {
        paths.push({
            slug: doc.slugAsParams.split("/"),
        });
    });
    
    return paths;
}

// Mark this page as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';

export default async function DocPage({ params }: DocPageProps) {
    // Add safe GitHub config
    const safeConfig = getSafeGitHubConfig();
    
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

    // Check if this is the index page
    if (!params.slug || params.slug.length === 0) {
        // For the index page, render the docs index
        const { DocsPageHeader } = await import("@/components/page-header")
        const Link = (await import("next/link")).default

        // Get unique doc categories
        const categories = Array.from(
            new Set(allDocs.map((doc) => doc.category))
        ).sort();

        return (
            <div className="container max-w-4xl py-6 lg:py-10">
                <DocsPageHeader 
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

    // For individual doc pages, render the doc content
    const doc = await getDocFromParams(params)

    if (!doc) {
        notFound()
    }

    // Import these only when needed (not on Vercel)
    const { getTableOfContents } = await import("@/lib/toc")
    const { Mdx } = await import("@/components/mdx-components")
    const { DocsPageHeader } = await import("@/components/page-header")
    const { DocsPager } = await import("@/components/pager")
    const { DashboardTableOfContents } = await import("@/components/toc")

    const toc = await getTableOfContents(doc.body.raw)

    return (
        <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
            <div className="mx-auto w-full min-w-0">
                <DocsPageHeader heading={doc.title} text={doc.description} />
                <Mdx code={doc.body.code} />
                <hr className="my-4 md:my-6" />
                <DocsPager doc={doc} />
            </div>
            <div className="hidden text-sm xl:block">
                <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
                    <DashboardTableOfContents toc={toc} />
                </div>
            </div>
        </main>
    )
}
