"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/Divider';
import EmptyState from '@/components/ui/empty-state';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { RiDeleteBinLine, RiPencilLine, RiAddLine, RiMoreFill, RiPhoneLine } from '@remixicon/react';
import { Icons } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuIconWrapper,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/DropdownMenu';
import BuyPhoneNumberDrawer from '@/components/phone-numbers/buy-phone-number-drawer';
import DashboardSidebar from '@/components/DashboardSidebar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type PhoneNumber = {
  id: string;
  number: string;
  agent: string;
  boughtOn: string;
  renewsOn: string;
  monthlyFee: string;
};

const dummyPhoneNumbers: PhoneNumber[] = [
  {
    id: '1',
    number: '+1234567890',
    agent: 'John Doe',
    boughtOn: '2023-01-01',
    renewsOn: '2024-01-01',
    monthlyFee: '$10.00',
  },
  {
    id: '2',
    number: '+0987654321',
    agent: '',
    boughtOn: '2023-02-01',
    renewsOn: '2024-02-01',
    monthlyFee: '$15.00',
  },
];

const dummyAgents = [
  { id: '1', name: 'Agent Smith' },
  { id: '2', name: 'Agent Johnson' },
];

const PhoneNumbersPage = () => {
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<PhoneNumber | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulate loading phone numbers
  useEffect(() => {
    const loadPhoneNumbers = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPhoneNumbers(dummyPhoneNumbers);
      } catch (error) {
        console.error('Error loading phone numbers:', error);
        toast.error('Failed to load phone numbers');
      } finally {
        setIsLoading(false);
      }
    };

    loadPhoneNumbers();
  }, []);

  const handleDeletePhoneNumber = (id: string) => {
    setPhoneNumbers(phoneNumbers.filter((phone) => phone.id !== id));
    setSelectedPhoneNumber(null);
    toast.success('Phone number deleted successfully');
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              My Phone Numbers
            </h2>
            <Button
              variant="secondary"
              className="h-8 w-8 p-0"
              onClick={() => setIsDrawerOpen(true)}
            >
              <RiAddLine className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Divider className="mt-4" />
        
        <div className="flex-1 overflow-auto px-4 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <span className="ml-2 text-sm text-gray-500">Loading phone numbers...</span>
            </div>
          ) : phoneNumbers.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 mt-1">
              {phoneNumbers.map((phone) => (
                <Card 
                  key={phone.id}
                  className={cn(
                    "group transition-all duration-200",
                    "hover:bg-gray-50 dark:hover:bg-gray-900",
                    "hover:shadow-sm",
                    "hover:border-gray-300 dark:hover:border-gray-700",
                    selectedPhoneNumber?.id === phone.id && [
                      "border-blue-500 dark:border-blue-500",
                      "bg-blue-50/50 dark:bg-blue-500/5",
                      "ring-1 ring-blue-500/20 dark:ring-blue-500/20"
                    ]
                  )}
                >
                  <div className="relative px-3.5 py-2.5">
                    <div className="flex items-center space-x-3">
                      <span
                        className={cn(
                          'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                          'bg-blue-100 dark:bg-blue-500/20',
                          'text-blue-800 dark:text-blue-500',
                          'transition-transform duration-200 group-hover:scale-[1.02]',
                          selectedPhoneNumber?.id === phone.id && [
                            "border-2 border-blue-500 dark:border-blue-500",
                            "shadow-[0_0_0_4px_rgba(59,130,246,0.1)]"
                          ]
                        )}
                        aria-hidden={true}
                      >
                        <RiPhoneLine className="h-5 w-5" />
                      </span>
                      <div className="truncate min-w-0">
                        <p className={cn(
                          "truncate text-sm font-medium text-gray-900 dark:text-gray-50",
                          selectedPhoneNumber?.id === phone.id && "text-blue-600 dark:text-blue-400"
                        )}>
                          <button 
                            onClick={() => setSelectedPhoneNumber(phone)}
                            className="focus:outline-none hover:no-underline no-underline"
                            type="button"
                          >
                            <span className="absolute inset-0" aria-hidden="true" />
                            {phone.number}
                          </button>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 pointer-events-none no-underline mt-0.5">
                          {phone.agent || 'No agent assigned'}
                        </p>
                      </div>
                    </div>

                    <div className="absolute right-2.5 top-2.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <RiMoreFill className="h-3.5 w-3.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-56">
                          <DropdownMenuLabel>Phone Number Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuGroup>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePhoneNumber(phone.id);
                              }}
                              className="text-red-600 dark:text-red-400"
                            >
                              <span className="flex items-center gap-x-2">
                                <DropdownMenuIconWrapper>
                                  <RiDeleteBinLine className="size-4 text-inherit" />
                                </DropdownMenuIconWrapper>
                                <span>Delete</span>
                              </span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center py-8 text-center">
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No phone numbers yet.
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <RiAddLine className="mr-2 h-4 w-4" />
                  Add Phone Number
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {selectedPhoneNumber ? (
          <div className="p-6">
            <header className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
              <div className="sm:flex sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                  {selectedPhoneNumber.number}
                </h3>
                <Button
                  variant="destructive"
                  onClick={() => handleDeletePhoneNumber(selectedPhoneNumber.id)}
                >
                  Delete
                </Button>
              </div>
            </header>
            <main>
              <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900 mb-4">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
                  <div className="flex items-center gap-2">
                    <Icons.speech className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <h4 className="text-md font-semibold text-gray-900 dark:text-gray-50">
                      Inbound Calls
                    </h4>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900/50">
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Assign an agent to handle calls to this phone number.
                  </p>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyAgents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>
              <Card className="overflow-hidden p-0 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-900">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-900">
                  <div className="flex items-center gap-2">
                    <Icons.billing className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <h4 className="text-md font-semibold text-gray-900 dark:text-gray-50">
                      Billing Information
                    </h4>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900/50">
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Monthly Fee: {selectedPhoneNumber.monthlyFee}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Bought On: {selectedPhoneNumber.boughtOn}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Renews On: {selectedPhoneNumber.renewsOn}
                  </p>
                </div>
              </Card>
            </main>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-6">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <RiPhoneLine className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {phoneNumbers.length > 0 
                  ? 'Select a Phone Number' 
                  : 'Welcome to Phone Numbers'}
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {phoneNumbers.length > 0 
                  ? 'Select a phone number from the sidebar or add a new one to get started.' 
                  : 'Add your first phone number to enhance your communication capabilities.'}
              </p>
              <Button className="mt-6" onClick={() => setIsDrawerOpen(true)}>
                <RiAddLine className="mr-2 h-4 w-4" />
                Add Phone Number
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Buy Phone Number Drawer */}
      <BuyPhoneNumberDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
};

export default PhoneNumbersPage;
