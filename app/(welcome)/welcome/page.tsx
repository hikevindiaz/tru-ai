'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/Label';
import { Divider } from '@/components/Divider';
import { useTheme } from 'next-themes';
import { Icons } from '@/components/icons';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { ChatBubbleLeftRightIcon, UserPlusIcon, CalendarIcon, ShoppingCartIcon, UserGroupIcon, EllipsisHorizontalIcon, ChatBubbleBottomCenterTextIcon, ChatBubbleLeftIcon, PhoneIcon, HashtagIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Instagram } from "lucide-react";
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from '@/components/ui/radio-card-group';
import { Switch } from '@/components/ui/switch';
import { RiCheckboxBlankCircleLine, RiCheckboxCircleFill } from '@remixicon/react';
import { ProgressBar } from '@/components/ProgressBar';
import { useRouter } from 'next/navigation';


export function StepperWithContent() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  return (
    <div className="w-full px-24 py-4 bg-white dark:bg-gray-950">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step onClick={() => setActiveStep(0)}>
          <UserIcon className="h-5 w-5" />
          <div className="absolute -bottom-[4.5rem] w-max text-center">
            <Typography variant="h6" color={activeStep === 0 ? "blue-gray" : "gray"}>
              Step 1
            </Typography>
            <Typography
              color={activeStep === 0 ? "blue-gray" : "gray"}
              className="font-normal"
            >
              Details about your account.
            </Typography>
          </div>
        </Step>
        <Step onClick={() => setActiveStep(1)}>
          <CogIcon className="h-5 w-5" />
          <div className="absolute -bottom-[4.5rem] w-max text-center">
            <Typography variant="h6" color={activeStep === 1 ? "blue-gray" : "gray"}>
              Step 2
            </Typography>
            <Typography
              color={activeStep === 1 ? "blue-gray" : "gray"}
              className="font-normal"
            >
              Details about your business.
            </Typography>
          </div>
        </Step>
        <Step onClick={() => setActiveStep(2)}>
          <BuildingLibraryIcon className="h-5 w-5" />
          <div className="absolute -bottom-[4.5rem] w-max text-center">
            <Typography variant="h6" color={activeStep === 2 ? "blue-gray" : "gray"}>
              Step 3
            </Typography>
            <Typography
              color={activeStep === 2 ? "blue-gray" : "gray"}
              className="font-normal"
            >
              Details about your agent setup.
            </Typography>
          </div>
        </Step>
      </Stepper>
      <div className="mt-32 flex justify-between">
        <Button variant="secondary" onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button variant="primary" onClick={handleNext} disabled={isLastStep}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default function OnboardingForm() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [country, setCountry] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 2: Your Business
  const [industryType, setIndustryType] = useState('');
  const [selectedTask, setSelectedTask] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string[]>([]);
  const [otherTaskDetail, setOtherTaskDetail] = useState('');

  // Step 3: Create Your First Agent
  const [agentName, setAgentName] = useState('');
  const [assistantTone, setAssistantTone] = useState('');
  const [customToneDetail, setCustomToneDetail] = useState('');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [language, setLanguage] = useState('');

  // Step 4: Plan Selection
  const [plan, setPlan] = useState('');

  // Country list (example)
  const countries = [
    { value: "USA", label: "USA" },
    { value: "UK", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
    { value: "ES", label: "Spain" },
    { value: "JP", label: "Japan" },
    { value: "AUS", label: "Australia" },
  ];

  // Language options
  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
  ];

  // Options for company size
  const companySizeOptions = ["Solo", "2-10", "11-50", "51-200", "201+"];

  // Options for industry type (Step 2)
  const industryOptions = ["E-commerce", "SaaS", "Restaurants", "Healthcare", "Real Estate", "Consulting", "Marketing", "Other"];

  // Options for what Link AI can do (Step 2)
  const businessTasksOptions = [
    { value: 'support', label: 'Support', icon: ChatBubbleLeftRightIcon },
    { value: 'lead', label: 'Leads', icon: UserPlusIcon },
    { value: 'schedule', label: 'Schedule', icon: CalendarIcon },
    { value: 'order', label: 'Orders', icon: ShoppingCartIcon },
    { value: 'hr', label: 'HR', icon: UserGroupIcon },
    { value: 'other', label: 'Other', icon: EllipsisHorizontalIcon }
  ];

  // Options for primary communication channels (Step 2)
  const channelOptions = [
    { value: 'web', label: 'Web', icon: ChatBubbleLeftRightIcon },
    { value: 'sms', label: 'SMS', icon: ChatBubbleBottomCenterTextIcon },
    { value: 'whatsapp', label: 'WhatsApp', icon: ChatBubbleLeftIcon },
    { value: 'phone', label: 'Calls', icon: PhoneIcon },
    { value: 'social', label: 'Social', icon: Instagram }
  ];

  // Options for Agent tone (Step 3)
  const toneOptions = [
    "Professional",
    "Friendly & Casual",
    "Sales-Oriented",
    "Custom"
  ];

  // Option for plan selection (Step 4)
  const planOptions = [
    "Free Trial – Free, limited to 1 AI agent, web widget only"
  ];

  // Step validations
  const isStep1Valid =
    fullName.trim() !== '' &&
    workEmail.trim() !== '' &&
    companySize.trim() !== '' &&
    country.trim() !== '' &&
    termsAccepted;
  
  const isStep2Valid = industryType.trim() !== '' && selectedTask.length > 0 && selectedChannel.length > 0;
  const isStep3Valid = assistantTone.trim() !== '';
  const isStep4Valid = plan.trim() !== '';

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Handlers for form navigation
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (isStep1Valid) {
        setStep(2);
      } else {
        console.log("Step 1 is not valid", {
          fullName, 
          workEmail, 
          companySize, 
          country, 
          termsAccepted
        });
      }
    } else if (step === 2) {
      if (isStep2Valid) {
        setStep(3);
      } else {
        console.log("Step 2 is not valid", { industryType, selectedTask, selectedChannel });
      }
    } else if (step === 3) {
      if (isStep3Valid) {
        setStep(4);
      } else {
        console.log("Step 3 is not valid", { assistantTone });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 4 && isStep4Valid) {
      // Submit data to server here, then:
      setStep(5);
    }
  };

  // Render the current step content
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="grid gap-5 my-6 sm:grid-cols-2 mt-8">
              <div className="mx-auto max-w-xs space-y-2 w-full">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  placeholder="Enter full name"
                  id="full-name"
                  name="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="mx-auto max-w-xs space-y-2 w-full">
                <Label htmlFor="work-email">Work Email</Label>
                <Input
                  placeholder="Enter work email"
                  id="work-email"
                  name="work-email"
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mx-auto max-w-xs space-y-2 w-full">
                <Label htmlFor="company-name">Company Name (Optional)</Label>
                <Input
                  placeholder="Enter company name"
                  id="company-name"
                  name="company-name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div className="mx-auto max-w-xs space-y-2 w-full">
                <Label htmlFor="business-website">Business Website (Optional)</Label>
                <Input
                  placeholder="Enter business website"
                  id="business-website"
                  name="business-website"
                  type="url"
                  value={businessWebsite}
                  onChange={(e) => setBusinessWebsite(e.target.value)}
                />
              </div>
              <div className="mx-auto max-w-xs space-y-2 w-full">
                <Label htmlFor="company-size">Company Size</Label>
                <Select value={companySize} onValueChange={(value) => setCompanySize(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizeOptions.map((size) => (
                      <SelectItem
                        key={size}
                        value={size}
                      >
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mx-auto max-w-xs space-y-2 w-full">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={(value) => setCountry(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mx-auto max-w-xs space-y-2 w-full flex items-center justify-center gap-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  required
                />
                <Label htmlFor="terms">
                  I agree to the Terms & Conditions and Privacy Policy.
                </Label>
              </div>
            </div>
            <div className="flex space-x-3">
              {/* No Prev button on Step 1 */}
              <Button
                type="submit"
                disabled={!isStep1Valid}
                variant="primary"
                className="w-full"
              >
                Next
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="grid gap-5 my-6 sm:grid-cols-2">
              <div className="mx-auto max-w-xs space-y-2 w-full">
                <Label htmlFor="industry">Industry Type</Label>
                <Select value={industryType} onValueChange={(value) => setIndustryType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="my-6">
              <Label className="mb-2">What do you want Link AI to do for you?</Label>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 w-full">
                {businessTasksOptions.map((item, index) => {
                  const isSelected = selectedTask.includes(item.value);
                  return (
                    <div
                      key={item.value}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTask(selectedTask.filter((v) => v !== item.value));
                        } else {
                          setSelectedTask([...selectedTask, item.value]);
                        }
                      }}
                      style={{
                        animationDuration: '600ms',
                        animationDelay: `${100 + index * 50}ms`,
                        animationFillMode: 'backwards',
                      }}
                      className={`group relative w-full rounded-md border p-4 text-left shadow-sm transition focus:outline-none cursor-pointer active:scale-[0.99] ${isSelected ? "bg-white dark:bg-gray-950 border-blue-500 text-gray-900 dark:text-gray-50" : "bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <item.icon className="h-5 w-5 text-blue-500" aria-hidden="true" />
                          <span className="block font-medium text-gray-900 dark:text-gray-50 text-xs">
                            {item.label}
                          </span>
                        </div>
                        <div className={`relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border shadow-sm outline-none ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-800 bg-transparent"}`}>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {selectedTask.includes("other") && (
                <div className="mt-4 space-y-2 w-full text-left">
                  <Label htmlFor="other-task">Please specify</Label>
                  <Input
                    placeholder="Enter details"
                    id="other-task"
                    name="other-task"
                    type="text"
                    value={otherTaskDetail}
                    onChange={(e) => setOtherTaskDetail(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="my-6">
              <Label className="mb-2">Primary Communication Channels</Label>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 w-full">
                {channelOptions.map((item, index) => {
                  const isSelected = selectedChannel.includes(item.value);
                  return (
                    <div
                      key={item.value}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedChannel(selectedChannel.filter((v) => v !== item.value));
                        } else {
                          setSelectedChannel([...selectedChannel, item.value]);
                        }
                      }}
                      style={{
                        animationDuration: '600ms',
                        animationDelay: `${100 + index * 50}ms`,
                        animationFillMode: 'backwards',
                      }}
                      className={`group relative w-full rounded-md border p-4 text-left shadow-sm transition focus:outline-none cursor-pointer active:scale-[0.99] ${isSelected ? "bg-white dark:bg-gray-950 border-blue-500 text-gray-900 dark:text-gray-50" : "bg-white dark:bg-gray-950 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <item.icon className="h-5 w-5 text-blue-500" aria-hidden="true" />
                          <span className="block font-medium text-gray-900 dark:text-gray-50 text-xs">
                            {item.label}
                          </span>
                        </div>
                        <div className={`relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border shadow-sm outline-none ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-800 bg-transparent"}`}>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="secondary"
                className="w-full"
              >
                Prev
              </Button>
              <Button
                type="submit"
                disabled={!isStep2Valid}
                variant="primary"
                className="w-full"
              >
                Next
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="grid gap-5 my-6 w-full">
              <div className="w-full space-y-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input
                  placeholder="Enter agent name"
                  id="agent-name"
                  name="agent-name"
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full space-y-2">
                <Label>What kind of Agent tone do you prefer?</Label>
                <RadioCardGroup
                  value={assistantTone}
                  onValueChange={(value) => setAssistantTone(value)}
                  required
                  aria-label="Select assistant tone"
                  className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 w-full"
                >
                  {toneOptions.map((tone, index) => (
                    <RadioCardItem
                      key={tone}
                      value={tone}
                      className="flex items-center gap-3 p-3 active:scale-[0.99] dark:bg-[#050814] w-full"
                      style={{
                        animationDuration: '600ms',
                        animationDelay: `${100 + index * 50}ms`,
                        animationFillMode: 'backwards',
                      }}
                    >
                      <RadioCardIndicator />
                      <span className="block font-medium text-gray-900 dark:text-gray-50 text-xs">
                        {tone}
                      </span>
                    </RadioCardItem>
                  ))}
                </RadioCardGroup>
                {assistantTone === 'Custom' && (
                  <div className="mt-4 w-full">
                    <Label htmlFor="custom-tone">Please specify</Label>
                    <Input
                      placeholder="Enter custom tone"
                      id="custom-tone"
                      name="custom-tone"
                      type="text"
                      value={customToneDetail}
                      onChange={(e) => setCustomToneDetail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="agent-prompt">Agent Prompt</Label>
                <Textarea
                  placeholder="Enter agent prompt"
                  id="agent-prompt"
                  name="agent-prompt"
                  value={agentPrompt}
                  onChange={(e) => setAgentPrompt(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Input
                  placeholder="Enter welcome message"
                  id="welcome-message"
                  name="welcome-message"
                  type="text"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={(value) => setLanguage(value)} className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={() => setStep(2)}
                variant="secondary"
                className="w-full"
              >
                Prev
              </Button>
              <Button
                type="submit"
                disabled={!isStep3Valid}
                variant="primary"
                className="w-full"
              >
                Next
              </Button>
            </div>
          </>
        );
      case 4: {
        const features = [
          { id: 1, name: '1 AI Agent' },
          { id: 2, name: 'Web Widget & Voice Chat' },
          { id: 3, name: '1 Add-on' },
          { id: 4, name: '1 Document' },
          { id: 5, name: '1,500 interactions/month' },
          { id: 6, name: '$10 /1K extra' },
          { id: 7, name: 'Email Support' },
          { id: 8, name: '"Powered by Link AI"' },
        ];
        return (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                  Free 7-Day Trial
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                  Enjoy full access to our core features during your trial.
                </p>
                <div className="mt-8 space-y-6">
                  <div className="relative border-l-2 border-gray-200 pl-4 dark:border-gray-800">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      <a href="#" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        Contact Sales &rarr;
                      </a>
                    </h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                      Have questions? Our team is here to help.
                    </p>
                  </div>
                  <div className="relative border-l-2 border-gray-200 pl-4 dark:border-gray-800">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      <a href="#" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        Enterprise Plans &rarr;
                      </a>
                    </h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                      Large teams or custom solutions? Contact us for a personalized plan.
                    </p>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => setPlan("free-trial")}
                className={`cursor-pointer rounded-lg border ${plan === "free-trial" ? "border-blue-500" : "border-gray-200 dark:border-gray-800"} bg-gray-50 p-6 dark:bg-gray-900`}
              >
                <div className="flex items-start justify-between space-x-6">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                    7-Day Free Trial
                  </h3>
                  <p className="flex items-baseline">
                    <span className="text-3xl font-semibold text-gray-900 dark:text-gray-50">
                      Free
                    </span>
                  </p>
                </div>
                <ul role="list" className="mt-4 text-xs text-gray-700 dark:text-gray-300">
                  {features.map((item) => (
                    <li key={item.id} className="flex items-center space-x-2 py-2">
                      <CheckCircleIcon className="h-5 w-5 shrink-0 text-blue-500 dark:text-blue-500" aria-hidden="true" />
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
                <Divider />
                <Button 
                  asChild 
                  className="h-10 w-full" 
                  onClick={(e) => { e.stopPropagation(); setPlan("free-trial") }}
                >
                  <a href="#">Select</a>
                </Button>
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <Button type="button" onClick={() => setStep(3)} variant="secondary" className="w-full">
                Prev
              </Button>
              <Button type="submit" disabled={!isStep4Valid} variant="primary" className="w-full">
                Submit
              </Button>
            </div>
          </>
        );
      }
      case 5: {
        const steps = [
          {
            id: '1.',
            title: 'Create your account',
            description: 'Your account has been successfully created.',
            status: 'complete',
            href: '#',
          },
          {
            id: '2.',
            title: 'Create your first agent',
            description: 'Your agent is now live.',
            status: 'complete',
            href: '#',
          },
          {
            id: '3.',
            title: 'Customize & Connect your agent',
            description: 'Tailor your agent and connect it to your system.',
            status: 'open',
            href: '#',
          },
        ];
        return (
          <div className="w-full max-w-lg text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Welcome to Link AI, {fullName || "User"}!
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              Next steps:
            </p>
            <ul role="list" className="mt-4 space-y-4">
              {steps.map((s) => (
                <li
                  key={s.id}
                  className="relative rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="flex items-start space-x-3">
                    {s.status === 'complete' ? (
                      <RiCheckboxCircleFill
                        className="size-6 shrink-0 text-blue-500 dark:text-blue-500"
                        aria-hidden={true}
                      />
                    ) : (
                      <span
                        className="flex size-6 items-center justify-center font-medium text-gray-500 dark:text-gray-500"
                        aria-hidden={true}
                      >
                        {s.id}
                      </span>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-50">
                        <a href={s.href} className="focus:outline-none">
                          <span className="absolute inset-0" aria-hidden={true} />
                          {s.title}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button variant="primary" onClick={() => router.push('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-start justify-center bg-white dark:bg-gray-950 pt-10 pb-10">
      <div className="w-full mx-auto max-w-2xl px-4 md:px-8 xl:px-0">
        <div className="fixed left-4 top-4 md:left-8 md:top-8 flex gap-2">
          <Button variant="secondary" className="flex items-center" onClick={() => window.location.href = '/login'}>
            <Icons.chevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="secondary" className="flex items-center" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Icons.moon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Icons.sun className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
        <form onSubmit={step === 4 ? handleSubmit : handleNext} className="mx-auto max-w-2xl my-8">
          <div>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Step {step}
            </span>
            <h1 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-50 sm:text-xl">
              {step === 1
                ? "Create your account"
                : step === 2
                ? "Your Business"
                : step === 3
                ? "Agent Setup"
                : step === 4
                ? "Plan Selection"
                : "Success"}
            </h1>
            <p className="mt-4 text-gray-700 dark:text-gray-300 sm:text-sm">
              {step === 1
                ? "Enter your personal and account details."
                : step === 2
                ? "Tell us about your business."
                : step === 3
                ? "Set up your Agent details."
                : step === 4
                ? "Choose a plan to get started."
                : ""}
            </p>
          </div>
          <div className="mt-12">
            {renderStep()}
          </div>
        </form>
      </div>
    </div>
  );
}