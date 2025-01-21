"use client";

import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarLink,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSubLink,
  SidebarProvider,
  useSidebar,
} from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { RiArrowDownSFill } from "@remixicon/react";
import { BookText, House, PackageSearch } from "lucide-react";
import Image from "next/image";
import { UserProfile } from "./UserProfile";
import { Divider } from "@/components/Divider";
import { Input } from "@/components/Input";
import { Icons } from "@/components/icons";
import { useTheme } from "next-themes";  // Theme hook for dark mode support
import MovingGradientIcon from "@/components/MovingGradientIcon";
import LinkAIProfileIcon from "@/components/LinkAIProfileIcon";
import { usePathname } from "next/navigation";
import { LinkAIAgentIcon } from "@/components/icons/LinkAIAgentIcon";

// Main navigation items
const navigation = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Icons.dashboard,
    notifications: false,
    active: false,
  },
  {
    name: "Inbox",
    href: "/dashboard/interactions",
    icon: Icons.mail,
    notifications: 2,
    active: false,
  },
];

// Nested navigation with dropdowns
const navigation2 = [
  {
    name: "Interactions",
    href: "#",
    icon: Icons.messagesSquare,
    children: [
      { name: "Orders", href: "/dashboard/orders", active: false },
      { name: "Leads", href: "/dashboard/leads", active: false },
      { name: "Customer Tickets", href: "/dashboard/tickets", active: false },
    ],
  },
  {
    name: "Agents",
    href: "#",
    icon: () => (
      <LinkAIAgentIcon 
        className="size-5 text-[#121826] dark:text-white" 
        aria-hidden="true"
      />
    ),
    children: [
      { name: "All Agents", href: "/dashboard/agents", active: false },
      { name: "Phone Numbers", href: "/dashboard/phone-numbers", active: false },
      { name: "Voices", href: "/dashboard/voices", active: false },
    ],
  },
  {
    name: "Knowledge Base",
    href: "/dashboard/files",
    icon: Icons.brain,
    children: [
      { name: "Files", href: "/dashboard/files", active: false },
      { name: "FAQ's", href: "/dashboard/faq", active: false },
    ],
  },
  {
    name: "Settings",
    href: "#",
    icon: Icons.settings,
    children: [
      { name: "Integrations", href: "/dashboard/integrations", active: false },
      { name: "Billing", href: "/dashboard/billing", active: false },
      { name: "General Settings", href: "/dashboard/settings", active: false },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();  // Initialize first

  const [openMenus, setOpenMenus] = React.useState<string[]>(() =>
  navigation2
    .filter((item) =>
      item.children?.some((child) => pathname === child.href)
    )
    .map((item) => item.name)
);


  const { theme } = useTheme();  // Detect the current theme (light or dark)
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
  
    const allPages = [
      ...navigation,
      ...navigation2.flatMap((item) =>
        item.children
          ? [{ ...item, isParent: true }, ...item.children]  // Include parent + children
          : [item]
      ),
    ];
  
    const filteredResults = allPages.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  
    setSearchResults(filteredResults);
  };

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <SidebarProvider>
      <Sidebar
        {...props}
        className={`h-screen flex flex-col justify-between flex-shrink-0 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >


        {/* Header */}
        <SidebarHeader className="px-3 py-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center">
              <LinkAIProfileIcon />
            </span>
            <div>
              <span className="block text-sm font-semibold">Link AI</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                for Business
              </span>
            </div>
          </div>
        </SidebarHeader>
   {/* Content */}
   <SidebarContent className="flex-1 overflow-y-auto">
        {/* Search Bar */}
        <SidebarGroup>
          <SidebarGroupContent>
            <div className="relative">
              <Input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search pages..."
                className="[&>input]:sm:py-1.5"
              />
  
              {/* 🔎 Search Results Dropdown */}
              {searchQuery && searchResults.length > 0 && (
                <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden dark:bg-gray-800">
                  {searchResults.map((result) => (
                    <button
                      key={result.href}
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        window.location.href = result.href; // 🔥 Navigate to the page
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {result.name}
                    </button>
                  ))}
                </div>
              )}
  
              {/* If no results */}
              {searchQuery && searchResults.length === 0 && (
                <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden dark:bg-gray-800">
                  No results found.
                </div>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
  
        {/* Navigation */}
        <SidebarGroup className="pt-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarLink
                    href={item.href}
                    isActive={pathname === item.href}
                    icon={item.icon}
                    notifications={item.notifications}
                  >
                    {item.name}
                  </SidebarLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
  
        {/* Divider */}
        <div className="px-3">
          <Divider className="my-0 py-0" />
        </div>
  
        {/* Nested Dropdown Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4">
              {navigation2.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-md p-2 w-full",
                      theme === "dark"
                        ? "text-white hover:bg-gray-800"
                        : "text-gray-900 hover:bg-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon
                        className="size-[18px] shrink-0"
                        aria-hidden="true"
                      />
                      {item.name}
                    </div>
                    <RiArrowDownSFill
                      className={cn(
                        openMenus.includes(item.name) ? "rotate-0" : "-rotate-90",
                        "size-5 shrink-0 transform text-gray-400 transition-transform"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  {item.children && openMenus.includes(item.name) && (
                    <SidebarMenuSub>
                      <div className="relative inset-y-0 left-4 w-px bg-gray-300 dark:bg-gray-800" />
                      {item.children.map((child) => (
                        <SidebarMenuItem key={child.name}>
                          <SidebarSubLink
                            href={child.href}
                            isActive={pathname === child.href}
                          >
                            {child.name}
                          </SidebarSubLink>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        </SidebarContent>
        {/* Footer */}
        <SidebarFooter>
          <div className="border-t border-gray-200 dark:border-gray-800" />
          {session && <UserProfile user={session.user} />}
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
