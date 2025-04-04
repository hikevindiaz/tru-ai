"use client"

import * as React from "react"
// import Link from "next/link"
// import { useSelectedLayoutSegment } from "next/navigation"

// import { MainNavItem } from "@/types"
// import { siteConfig } from "@/config/site"
// import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
// import { MobileNav } from "@/components/mobile-nav"

interface MainNavProps {
  items?: MainNavItem[]
  children?: React.ReactNode
}

export function MainNav({ items, children }: MainNavProps) {
  // const segment = useSelectedLayoutSegment()
  // const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  return (
    <div className="flex gap-6 md:gap-10">
      {/* Main navigation content is hidden */}
    </div>
  )
}