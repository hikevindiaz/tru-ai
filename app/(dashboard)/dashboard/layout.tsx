"use client";

import { SidebarProvider } from "@/components/Sidebar";
import { AppSidebar } from "@/components/ui/navigation/AppSidebar";
import { Breadcrumbs } from "@/components/ui/navigation/Breadcrumbs";
import { Toaster } from "@/components/Toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="w-full flex h-full">
        <Toaster />
        <AppSidebar />
        <main className="flex-grow px-0 py-0bg-gray-100 dark:bg-gray-950">{children}</main>
      </div>
    </SidebarProvider>
  );
}
