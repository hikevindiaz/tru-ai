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
import { BookText, MessageSquare, Mouse, PackageSearch, PanelLeft, PanelRight } from "lucide-react";
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
import { Button } from "@/components/Button";

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
      { name: "General Settings", href: "/dashboard/settings", active: false },
    ],
  },
];

export function AppSidebar({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname();  // Initialize first
  const { toast } = useToast();
  // State to track sidebar collapsed state
  const [collapsed, setCollapsed] = useState(false);

  const [openMenus, setOpenMenus] = React.useState<string[]>(() =>
  navigation2
    .filter((item) =>
      item.children?.some((child) => pathname === child.href)
    )
    .map((item) => item.name)
);

  const { theme, resolvedTheme } = useTheme();  // Access resolvedTheme for more accurate theme detection
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined);
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [inboxUnreadCount, setInboxUnreadCount] = useState(0);
  const [knownThreadIds, setKnownThreadIds] = useState<string[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state and initialize currentTheme
  useEffect(() => {
    setIsMounted(true);
    setCurrentTheme(resolvedTheme);
    
    return () => {
      setIsMounted(false);
    };
  }, [resolvedTheme]);
  
  // Effect to keep currentTheme updated whenever resolvedTheme changes
  useEffect(() => {
    if (isMounted && resolvedTheme) {
      setCurrentTheme(resolvedTheme);
    }
  }, [isMounted, resolvedTheme]);
  
  // Effect to adjust sidebar based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else if (window.innerWidth > 1280) {
        setCollapsed(false);
      }
    };
    
    // Set initial state based on screen size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Fetch unread count on initial mount and when events trigger it
  useEffect(() => {
    // Set mounted flag for cleanup
    setIsMounted(true);
    
    const fetchUnreadCount = async () => {
      try {
        const now = Date.now();
        
        // Only fetch if:
        // 1. This is the initial load (lastFetchTime is 0)
        // 2. OR it's been at least 5 minutes since the last fetch
        // 3. OR we're responding to a specific event (handled by event listeners)
        if (lastFetchTime === 0 || now - lastFetchTime > 300000) {
          const response = await fetch('/api/inbox/unread');
          setLastFetchTime(now);
          
          if (response.ok) {
            const data = await response.json();
            
            // Update the navigation array with the new count
            navigation.forEach(item => {
              if (item.name === "Inbox") {
                // Only show notifications when there are unread messages
                item.notifications = data.count > 0 ? data.count : false;
              }
            });
            
            // Set the unread count state
            setInboxUnreadCount(data.count);
            
            // Update known thread IDs if needed
            if (data.threads && data.threads.length > 0) {
              const currentThreadIds = data.threads.map((thread: Thread) => thread.threadId);
              if (knownThreadIds.length === 0 || JSON.stringify(currentThreadIds) !== JSON.stringify(knownThreadIds)) {
                setKnownThreadIds(currentThreadIds);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };
    
    // Initial fetch when component mounts
    fetchUnreadCount();
    
    // Set up event listeners for real-time updates
    const handleThreadRead = () => {
      fetchUnreadCount();
    };
    
    const handleNewInboxMessage = () => {
      fetchUnreadCount();
    };
    
    // Listen for thread read events
    window.addEventListener('inboxThreadRead', handleThreadRead);
    
    // Listen for new message events 
    window.addEventListener('newInboxMessage', handleNewInboxMessage);
    
    // Listen for route changes - only fetch when navigating to the dashboard
    const handleRouteChange = (url: string) => {
      // Only fetch unread count when navigating to the dashboard
      if (url.startsWith('/dashboard') && !url.includes('/dashboard/inbox')) {
        fetchUnreadCount();
      }
    };
    
    // Add route change listener (Next.js router events)
    if (typeof window !== 'undefined') {
      window.addEventListener('routeChangeComplete', handleRouteChange as any);
    }
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('inboxThreadRead', handleThreadRead);
      window.removeEventListener('newInboxMessage', handleNewInboxMessage);
      if (typeof window !== 'undefined') {
        window.removeEventListener('routeChangeComplete', handleRouteChange as any);
      }
      setIsMounted(false);
    };
  }, [knownThreadIds, lastFetchTime]);

  // Additional useEffect to refresh data periodically when user is active
  useEffect(() => {
    // Only set up very infrequent refresh when mounted
    if (!isMounted) return;
    
    // User activity detection variables
    let userIsActive = true;
    let activityTimeout: NodeJS.Timeout;
    
    const refreshIfUserActive = async () => {
      if (userIsActive) {
        try {
          const now = Date.now();
          // Only fetch if it's been at least 5 minutes since the last fetch
          if (now - lastFetchTime > 300000) {
            const response = await fetch('/api/inbox/unread');
            setLastFetchTime(now);
            
            if (response.ok) {
              const data = await response.json();
              
              navigation.forEach(item => {
                if (item.name === "Inbox") {
                  item.notifications = data.count > 0 ? data.count : false;
                }
              });
              
              setInboxUnreadCount(data.count);
              
              if (data.threads && data.threads.length > 0) {
                const currentThreadIds = data.threads.map((thread: Thread) => thread.threadId);
                if (JSON.stringify(currentThreadIds) !== JSON.stringify(knownThreadIds)) {
                  setKnownThreadIds(currentThreadIds);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error in periodic refresh:', error);
        }
      }
    };
    
    // Track user activity
    const handleUserActivity = () => {
      userIsActive = true;
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        userIsActive = false;
      }, 300000); // Consider user inactive after 5 minutes of no activity
    };
    
    // Set up user activity listeners
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    
    // Set initial activity state
    handleUserActivity();
    
    // Set up a very infrequent polling - every 10 minutes
    const intervalId = setInterval(refreshIfUserActive, 600000); // 10 minutes
    
    return () => {
      clearInterval(intervalId);
      clearTimeout(activityTimeout);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
    };
  }, [isMounted, lastFetchTime, knownThreadIds]);

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
    if (collapsed) {
      // If sidebar is collapsed and user clicks on a menu,
      // expand the sidebar first and then open that menu
      setCollapsed(false);
      setOpenMenus([name]);
      return;
    }
    
    setOpenMenus((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  // Toggle sidebar expanded/collapsed state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    // Close all open menus when collapsing
    if (!collapsed) {
      setOpenMenus([]);
    }
  };

  // Only render when mounted to avoid flashing wrong theme
  if (!isMounted) {
    return null;
  }

  // Determine theme class based on resolvedTheme for more accurate theme detection
  const themeClass = currentTheme === "dark" 
    ? "bg-gray-950 text-white" 
    : "bg-gray-50 text-gray-900";

  return (
    <div
      {...props}
      className={cn(
        "h-screen flex flex-col justify-between flex-shrink-0 transition-all duration-300",
        "border-r border-gray-200 dark:border-gray-800",
        themeClass,
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className={cn(
        "px-3 py-4 flex items-center justify-between",
      )}>
        <div className={cn(
          "flex items-center", 
          "gap-3"
        )}>
          <span className="flex items-center justify-center">
            <LinkAIProfileIcon />
          </span>
          {!collapsed && (
            <div>
              <span className="block text-sm font-semibold">Link AI</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                for Business
              </span>
            </div>
          )}
        </div>
        {/* Only show the button in the header when NOT collapsed */}
        {!collapsed && (
          <Button
            variant="ghost"
            aria-label="Collapse sidebar"
            onClick={toggleSidebar}
            className="h-8 w-8 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <PanelLeft className="size-[18px] shrink-0" aria-hidden="true" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Bar - only show when expanded */}
        {!collapsed && (
          <div className="relative flex w-full min-w-0 flex-col p-3">
            <div className="w-full text-sm">
              <div className="relative">
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search pages..."
                  className="[&>input]:sm:py-1.5"
                />
      
                {/* Search Results Dropdown */}
                {searchQuery && searchResults.length > 0 && (
                  <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-md overflow-hidden dark:bg-gray-800">
                    {searchResults.map((result) => (
                      <button
                        key={result.href}
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                          window.location.href = result.href;
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
            </div>
          </div>
        )}
  
        {/* Navigation */}
        <div className="relative flex w-full min-w-0 flex-col p-3 pt-0">
          <div className="w-full text-sm">
            <ul className="flex w-full min-w-0 flex-col gap-1 space-y-1">
              {/* Add toggle button as a normal navigation item when collapsed */}
              {collapsed && (
                <li>
                  <button
                    onClick={toggleSidebar}
                    aria-label="Expand sidebar"
                    className={cn(
                      "flex w-full items-center justify-left rounded-md p-2 text-base transition hover:bg-gray-200/50 sm:text-sm hover:dark:bg-gray-900",
                      "text-gray-900 dark:text-gray-400", // Match exact text color of other icons
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    )}
                  >
                    <PanelRight className="size-[18px] shrink-0" aria-hidden="true" />
                  </button>
                </li>
              )}
              
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    data-active={pathname === item.href}
                    className={cn(
                      "flex items-center justify-between rounded-md p-2 text-base transition hover:bg-gray-200/50 sm:text-sm hover:dark:bg-gray-900",
                      "text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                      "data-[active=true]:text-indigo-600 data-[active=true]:dark:text-indigo-500",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    )}
                  >
                    <span className={cn("flex items-center", "gap-x-2.5")}>
                      {item.icon && <item.icon className="size-[18px] shrink-0" aria-hidden="true" />}
                      {!collapsed && item.name}
                    </span>
                    {item.notifications && (
                      <span className={cn(
                        "inline-flex size-5 items-center justify-center rounded bg-indigo-100 text-sm font-medium text-indigo-600 sm:text-xs dark:bg-indigo-500/10 dark:text-indigo-500",
                        collapsed && "absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 size-4"
                      )}>
                        {item.notifications}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Divider */}
        <div className="px-3">
          <Divider className="my-0 py-0" />
        </div>
  
        {/* Nested Dropdown Navigation */}
        <div className="relative flex w-full min-w-0 flex-col p-3">
          <div className="w-full text-sm">
            <ul className="flex w-full min-w-0 flex-col gap-1 space-y-4">
              {navigation2.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-md p-2 w-full",
                      collapsed && "justify-center",
                      theme === "dark"
                        ? "text-white hover:bg-gray-800"
                        : "text-gray-900 hover:bg-gray-200"
                    )}
                  >
                    <div className={cn("flex items-center gap-2")}>
                      <item.icon
                        className="size-[18px] shrink-0"
                        aria-hidden="true"
                      />
                      {!collapsed && item.name}
                    </div>
                    {!collapsed && (
                      <RiArrowDownSFill
                        className={cn(
                          openMenus.includes(item.name) ? "rotate-0" : "-rotate-90",
                          "size-5 shrink-0 transform text-gray-400 transition-transform"
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                  {item.children && openMenus.includes(item.name) && !collapsed && (
                    <ul className="relative space-y-1 border-l border-transparent">
                      <div className="relative inset-y-0 left-4 w-px bg-gray-300 dark:bg-gray-800" />
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <a
                            href={child.href}
                            aria-current={pathname === child.href ? "page" : undefined}
                            data-active={pathname === child.href}
                            className={cn(
                              "relative flex gap-2 rounded-md py-1.5 pl-9 pr-3 text-base transition sm:text-sm",
                              "text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                              "data-[active=true]:rounded data-[active=true]:bg-white data-[active=true]:text-indigo-600 data-[active=true]:shadow data-[active=true]:ring-1 data-[active=true]:ring-gray-200 data-[active=true]:dark:bg-gray-900 data-[active=true]:dark:text-indigo-500 data-[active=true]:dark:ring-gray-800",
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            )}
                          >
                            {pathname === child.href && (
                              <div
                                className="absolute left-4 top-1/2 h-5 w-px -translate-y-1/2 bg-indigo-500 dark:bg-indigo-500"
                                aria-hidden="true"
                              />
                            )}
                            {child.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className={cn("flex flex-col gap-2 p-3", collapsed ? "px-0" : "")}>
        <div className="border-t border-gray-200 dark:border-gray-800" />
        {session && <UserProfile user={session.user} collapsed={collapsed} />}
      </div>
    </div>
  );
}
