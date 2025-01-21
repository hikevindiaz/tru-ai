'use client';

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardStats } from "@/components/dashboard/stats";
import { MessagesChart } from "@/components/dashboard/messages-chart";
import { UserInquiriesGrid } from "@/components/dashboard/user-inquiries";
import { ErrorsTable } from "@/components/dashboard/errors-table";
import { DashboardOverview } from '@/components/dashboard/overview-header';

// Keep the interfaces and type definitions
interface UserInquiry {
  id: string;
  name: string;
  initial: string;
  textColor: string;
  bgColor: string;
  email: string;
  href: string;
  details: {
    type: string;
    value: string;
  }[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    kpiData: [],
    messageData: [],
    totalMessages: 0,
    userInquiries: [],
    errorData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/dashboard/stats');
          const data = await response.json();
          
          setDashboardData({
            kpiData: [
              {
                name: 'Total Agents',
                stat: data.totalAgents.toString(),
                change: '12.1%',
                changeType: 'positive',
              },
              {
                name: 'Total Files',
                stat: data.totalFiles.toString(),
                change: '9.8%',
                changeType: 'negative',
              },
              {
                name: 'Total Messages in 30 Days',
                stat: data.messageCountLast30Days.toString(),
                change: '7.7%',
                changeType: 'positive',
              }
            ],
            messageData: data.messagesPerDay.map(item => ({
              date: item.name,
              Messages: item.total
            })),
            totalMessages: data.messagesPerDay[data.messagesPerDay.length - 1]?.total || 0,
            userInquiries: data.userInquiries,
            errorData: data.chatbotErrors
          });
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch dashboard stats:', error);
        }
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const userFirstName = session?.user?.name?.split(' ')[0] || '';

  return (
    <>
      <DashboardHeader 
        loading={loading}
        userFirstName={userFirstName}
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <DashboardOverview />
        <DashboardStats data={dashboardData.kpiData} />
        <MessagesChart 
          data={dashboardData.messageData}
          totalMessages={dashboardData.totalMessages}
        />
        <UserInquiriesGrid inquiries={dashboardData.userInquiries} />
        <ErrorsTable errors={dashboardData.errorData} />
      </div>
    </>
  );
}
