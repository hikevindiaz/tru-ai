"use client";

import React, { useEffect, useState } from "react";

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
import { BookText, MessageSquare, Mouse, PackageSearch } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

// Define thread interface for type safety
interface Thread {
  threadId: string;
  messageCount: number;
}

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
    href: "/dashboard/inbox",
    icon: Icons.mail,
    notifications: 0, // We'll update this dynamically
    active: false,
  },
];

// Nested navigation with dropdowns
const navigation2 = [
  {
    name: "Activity",
    href: "#",
    icon: Icons.messagesSquare,
    children: [
      { name: "Orders", href: "/dashboard/orders", active: false },
      { name: "Smart Forms", href: "/dashboard/forms", active: false },
      { name: "Customer Tickets", href: "/dashboard/tickets", active: false },
      { name: "Calendar", href: "/dashboard/calendar", active: false },
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
    href: "/dashboard/knowledge-base",
    icon: Icons.brain,
    children: [
      { name: "Sources", href: "/dashboard/knowledge-base", active: false },
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
  const { toast } = useToast();

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
  const [inboxUnreadCount, setInboxUnreadCount] = useState(0);
  const [knownThreadIds, setKnownThreadIds] = useState<string[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  
  // Move the useRef hook to the top level of the component
  const lastNotificationTimeRef = React.useRef<number>(0);

  // Fetch unread count on mount and when pathname changes to/from inbox
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        // Skip fetching if the last fetch was less than 10 seconds ago and there were no unread messages
        const now = Date.now();
        if (inboxUnreadCount === 0 && now - lastFetchTime < 10000) {
          return;
        }
        
        console.log('Fetching unread count...');
        const response = await fetch('/api/inbox/unread');
        setLastFetchTime(now);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Unread count data:', data);
          
          // Update the navigation array with the new count
          navigation.forEach(item => {
            if (item.name === "Inbox") {
              // Only show notifications when there are unread messages
              item.notifications = data.count > 0 ? data.count : false;
            }
          });
          
          // Set the unread count state
          setInboxUnreadCount(data.count);
          
          // Check for new threads (not just new messages in existing threads)
          if (data.threads && data.threads.length > 0) {
            // Get the current thread IDs from the response
            const currentThreadIds = data.threads.map((thread: Thread) => thread.threadId);
            
            // Find completely new threads that we haven't seen before
            const newThreadIds = currentThreadIds.filter(
              (threadId: string) => !knownThreadIds.includes(threadId)
            );
            
            // If we have new threads and it's been at least 10 seconds since our last notification
            if (newThreadIds.length > 0 && (now - lastNotificationTimeRef.current > 10000)) {
              console.log("New threads detected:", newThreadIds);
              
              // Update the last notification time
              lastNotificationTimeRef.current = now;
              
              // Show toast for new threads
              toast({
                title: "New Conversation",
                description: `You have ${newThreadIds.length} new conversation${newThreadIds.length > 1 ? 's' : ''} in your inbox`,
                variant: "info",
                duration: 5000,
              });
              
              // Update our known thread IDs to include the new ones
              setKnownThreadIds(currentThreadIds);
            } else if (knownThreadIds.length === 0) {
              // First load, just store the thread IDs without showing a toast
              setKnownThreadIds(currentThreadIds);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };
    
    // Initial fetch
    fetchUnreadCount();
    
    // Set up polling to check for new messages
    // Use a more reasonable interval - 60 seconds for no unread messages, 30 seconds when there are unread messages
    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, inboxUnreadCount > 0 ? 30000 : 60000);
    
    // Listen for the custom event when a thread is marked as read
    const handleThreadRead = () => {
      console.log('Thread read event received, refreshing unread count');
      fetchUnreadCount();
    };
    
    window.addEventListener('inboxThreadRead', handleThreadRead);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('inboxThreadRead', handleThreadRead);
    };
  }, [knownThreadIds, toast, inboxUnreadCount, lastFetchTime]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
  
    // Fix the type issues with the search functionality
    type SearchableItem = {
      name: string;
      href: string;
      [key: string]: any;
    };
    
    const allPages: SearchableItem[] = [
      ...navigation as SearchableItem[],
      ...navigation2.flatMap((item) => {
        if (item.children) {
          return [{ ...item, isParent: true } as SearchableItem, ...item.children as SearchableItem[]];
        }
        return [item as SearchableItem];
      }),
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
          theme === "dark" ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
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
