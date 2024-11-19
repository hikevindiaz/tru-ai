import { getCurrentUser } from "@/lib/session"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Chatbot, User } from "@prisma/client"
import { db } from "@/lib/db"
import Link from "next/link"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { CodeBlock } from "@/components/ui/codeblock"
import { siteConfig } from "@/config/site"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ChatbotSettingsProps {
    params: { chatbotId: string }
}

async function getChatbotForUser(chatbotId: Chatbot["id"], userId: User["id"]) {
    return await db.chatbot.findFirst({
        where: {
            id: chatbotId,
            userId: userId,
        },
    })
}

export default async function EmbedOnSitePage({ params }: ChatbotSettingsProps) {

    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/login")
    }

    const chatbot = await getChatbotForUser(params.chatbotId, user.id)

    if (!chatbot) {
        notFound()
    }

    return (
        <DashboardShell>
            <DashboardHeader heading="Embed On Website" text="Make your chatbot publicly accessible for users.">
                <Link
                    href={`/dashboard/chatbots`}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "md:left-8 md:top-8"
                    )}
                >
                    <>
                        <Icons.chevronLeft className="mr-2 h-4 w-4" />
                        Back
                    </>
                </Link>
            </DashboardHeader>

            <Tabs className="w-full overflow-x-auto max-w-full" defaultValue="widget">
                <TabsList className="mb-10 grid w-full grid-cols-5 gap-4">
                    <TabsTrigger value="widget">Widget</TabsTrigger>
                    <TabsTrigger value="window">Window</TabsTrigger>
                </TabsList>
                <TabsContent value="window">
                    <div className="space-y-4">
                        <CodeBlock
                            language="html"
                            value={`<iframe 
    src="${siteConfig.url}embed/${params.chatbotId}/window?chatbox=false"
    style="overflow: hidden; height: 80vh; width: 480px; bottom: -30px; border: 2px solid #e2e8f0; border-radius: 0.375rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);"
    allowfullscreen allow="clipboard-read; clipboard-write" 
>
</iframe>
 <!-- This chatbot is build using https://www.getlinkai.com/ -->
`}>
                        </CodeBlock>
                    </div>
                </TabsContent>
                <TabsContent value="widget">
                    <div className="space-y-4">
                        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4" role="alert">
                            <p className="font-bold text-md">Instructions</p>
                            <p className="text-sm">To embed the chatbot on your website, add the following script to the head section of your HTML:</p>
                        </div>
                        <CodeBlock
                            language="html"
                            value={`<script>
    window.chatbotConfig = { chatbotId: '${params.chatbotId}' };
    (function() {
        var script = document.createElement('script');
        script.src = 'https://dashboard.getlinkai.com/chatbot.js';
        document.head.appendChild(script);
    })();
</script>
 <!-- This chatbot is built using https://www.getlinkai.com/ -->
`}>
                        </CodeBlock>
                    </div>
                </TabsContent>
            </Tabs>
        </DashboardShell>
    )
}