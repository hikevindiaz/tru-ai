import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  RadioCardGroup, 
  RadioCardItem,
  RadioCardIndicator 
} from "@/components/ui/radio-group";
import { Icons } from "@/components/icons";

interface CreateAgentDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreateAgent: (name: string, templateId: string) => void;
}

const agentTemplates = [
  {
    id: 'custom',
    name: 'Custom Agent',
    description: 'Create a custom agent from scratch',
    isRecommended: true,
    disabled: false,
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    description: 'General purpose customer service agent',
    isRecommended: false,
    disabled: true,
  },
  {
    id: 'sales',
    name: 'Sales Representative',
    description: 'Specialized in product sales and inquiries',
    isRecommended: false,
    disabled: true,
  },
  {
    id: 'support',
    name: 'Technical Support',
    description: 'Handles technical issues and troubleshooting',
    isRecommended: false,
    disabled: true,
  },
];

export function CreateAgentDrawer({ open, onClose, onCreateAgent }: CreateAgentDrawerProps) {
  const [name, setName] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState('custom');

  const handleSubmit = () => {
    onCreateAgent(name, selectedTemplate);
    setName('');
    setSelectedTemplate('custom');
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="border-gray-100 dark:border-gray-800 pb-4">
          <DrawerTitle className="text-gray-900 dark:text-gray-100 text-lg font-semibold after:content-none">
            Create New Agent
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <div className="space-y-6">
            <div>
              <Label className="font-medium text-gray-900 dark:text-gray-100">Agent Name</Label>
              <div className="mt-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter agent name"
                  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800"
                />
              </div>
            </div>

            <fieldset className="space-y-3">
              <Label className="font-medium text-gray-900 dark:text-gray-100">Template</Label>
              <RadioCardGroup
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
                className="mt-2 grid grid-cols-1 gap-4 text-sm"
              >
                {agentTemplates.map((template) => (
                  <RadioCardItem 
                    key={template.id} 
                    value={template.id}
                    disabled={template.disabled}
                    className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                  >
                    <div className="flex items-start gap-3">
                      <RadioCardIndicator className="mt-1 text-blue-500 dark:text-blue-400" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="leading-6 text-gray-900 dark:text-gray-100">
                            {template.name}
                          </span>
                          {template.isRecommended && (
                            <Badge variant="success">Recommended</Badge>
                          )}
                          {template.disabled && (
                            <Badge variant="neutral">Coming Soon</Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </RadioCardItem>
                ))}
              </RadioCardGroup>
            </fieldset>
          </div>
        </DrawerBody>
        <DrawerFooter className="border-t border-gray-100 dark:border-gray-800">
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
          <Button 
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Create Agent
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
} 