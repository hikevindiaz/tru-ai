"use client";

import { SidebarProvider } from "@/components/Sidebar";
import { AppSidebar } from "@/components/ui/navigation/AppSidebar";
import { Card, Title, Text } from "@tremor/react";
import { Breadcrumbs } from "@/components/ui/navigation/Breadcrumbs"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { cookies } from "next/headers"
import "@/styles/globals.css"
import { siteConfig } from "@/config/site"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="w-full flex h-full">
        <AppSidebar />
        <main className="flex-grow px-0 py-0bg-gray-100 dark:bg-gray-900">{children}</main>
      </div>
    </SidebarProvider>
  );
}
