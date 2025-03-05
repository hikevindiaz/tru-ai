import { notFound } from "next/navigation"
import "@/styles/mdx.css"
import { Metadata } from "next"
import { absoluteUrl, cn } from "@/lib/utils"

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

interface GuidePageProps {
    params: {
        slug: string[]
    }
}

async function getGuideFromParams(params: any) {
    if (isVercel) return null;
    
    const slug = params?.slug?.join("/")
    const guide = allGuides.find((guide) => guide.slugAsParams === slug)

    if (!guide) {
        return null
    }

    return guide
}

export async function generateMetadata({
    params,
}: GuidePageProps): Promise<Metadata> {
    const guide = await getGuideFromParams(params)

    if (!guide) {
        return {}
    }

    const url = process.env.NEXT_PUBLIC_VERCEL_URL

    const ogUrl = new URL(`${url}/api/og`)
    ogUrl.searchParams.set("heading", guide.title)
    ogUrl.searchParams.set("type", "Guide")
    ogUrl.searchParams.set("mode", "dark")

    return {
        title: guide.title,
        description: guide.description,
        openGraph: {
            title: guide.title,
            description: guide.description,
            type: "article",
            url: absoluteUrl(guide.slug),
            images: [
                {
                    url: ogUrl.toString(),
                    width: 1200,
                    height: 630,
                    alt: guide.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: guide.title,
            description: guide.description,
            images: [ogUrl.toString()],
        },
    }
}

export async function generateStaticParams(): Promise<
    GuidePageProps["params"][]
> {
    if (isVercel) return [];
    
    return allGuides.map((guide) => ({
        slug: guide.slugAsParams.split("/"),
    }))
}

export default async function GuidePage({ params }: GuidePageProps) {
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

    // Original implementation for local development
    const guide = await getGuideFromParams(params)

    if (!guide) {
        notFound()
    }

    // Import these only when needed (not on Vercel)
    const { getTableOfContents } = await import("@/lib/toc")
    const { Icons } = await import("@/components/icons")
    const { Mdx } = await import("@/components/mdx-components")
    const { DocsPageHeader } = await import("@/components/page-header")
    const { DashboardTableOfContents } = await import("@/components/toc")
    const { buttonVariants } = await import("@/components/ui/button")
    const Link = (await import("next/link")).default

    const toc = await getTableOfContents(guide.body.raw)

    return (
        <main className="relative py-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 lg:py-10 xl:gap-20">
            <div>
                <DocsPageHeader heading={guide.title} text={guide.description} />
                <Mdx code={guide.body.code} />
                <hr className="my-4" />
                <div className="flex justify-center py-6 lg:py-10">
                    <Link
                        href="/guides"
                        className={cn(buttonVariants({ variant: "ghost" }))}
                    >
                        <Icons.chevronLeft className="mr-2 h-4 w-4" />
                        See all guides
                    </Link>
                </div>
            </div>
            <div className="hidden text-sm lg:block">
                <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
                    <DashboardTableOfContents toc={toc} />
                </div>
            </div>
        </main>
    )
}
