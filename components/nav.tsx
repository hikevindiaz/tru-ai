"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { SidebarNavItem } from "@/types"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { UpgradePlanButton } from "./upgrade-plan-button"
import { Icons } from "@/components/icons" // Ensure this path is correct

interface DashboardNavProps {
    items: SidebarNavItem[]
}

export function DashboardNav({ items }: DashboardNavProps) {
    const path = usePathname()

    if (!items?.length) {
        return null
    }

    return (
        <nav className="flex flex-col justify-between h-full">
            <div className="flex flex-col items-center">
                <img src="/LINK LOGO WHITE.png" alt="Link AI Logo" className="h-8 w-auto mb-1" />
                <svg xmlns="http://www.w3.org/2000/svg" width="234" height="1" viewBox="0 0 234 1" fill="none" className="mb-2">
                    <path d="M0 0.5H233.25" stroke="url(#paint0_linear_1702_10769)"/>
                    <defs>
                        <linearGradient id="paint0_linear_1702_10769" x1="0" y1="0.5" x2="231" y2="0.5" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#E0E1E2" stopOpacity="0"/>
                            <stop offset="0.5" stopColor="#E0E1E2"/>
                            <stop offset="1" stopColor="#E0E1E2" stopOpacity="0.15625"/>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className="flex flex-col gap-1">
                {items.map((item, index) => {
                    const Icon = Icons[item.icon || "arrowRight"]
                    return (
                        item.href && (
                            <Link key={index} href={item.disabled ? "/" : item.href}>
                                <span
                                    className={cn(
                                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                        path === item.href ? "bg-accent" : "transparent",
                                        item.disabled && "cursor-not-allowed opacity-80"
                                    )}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    <span>{item.title}</span>
                                </span>
                            </Link>
                        )
                    )
                })}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Upgrade your plan</CardTitle>
                    <CardDescription className="text-xs">
                        Unlock more features by upgrading your plan and get premium support.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UpgradePlanButton size="sm" />
                </CardContent>
            </Card>
        </nav>
    )
}