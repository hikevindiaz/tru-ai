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
    // If this is the index page (the slug is "index")
    if (params.slug.length === 1 && params.slug[0] === "index") {
        return {
            title: "Guides",
            description: "Learn how to use our product with our comprehensive guides.",
        }
    }

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
    if (isVercel) return [{ slug: ["index"] }];
    
    // Include the root guides page as "index"
    const paths = [{ slug: ["index"] }];
    
    // Add all the individual guide pages
    allGuides.forEach((guide) => {
        paths.push({
            slug: guide.slugAsParams.split("/"),
        });
    });
    
    return paths;
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

    // Check if this is the index page
    if (params.slug.length === 1 && params.slug[0] === "index") {
        // For the index page, render the guides index
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
        );
    }

    // For individual guide pages, render the guide content
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
