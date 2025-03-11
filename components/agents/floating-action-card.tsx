import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FloatingActionCardProps {
  isSaving: boolean;
  isDirty: boolean;
  onSave: () => void;
  onCancel: () => void;
  className?: string;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  errorMessage?: string;
}

export function FloatingActionCard({
  isSaving,
  isDirty,
  onSave,
  onCancel,
  className,
  saveStatus = 'idle',
  errorMessage = 'Failed to save changes',
}: FloatingActionCardProps) {
  const [visible, setVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Show the card when it's dirty or has a status
  useEffect(() => {
    if (isDirty || saveStatus !== 'idle') {
      setVisible(true);
    }
  }, [isDirty, saveStatus]);
  
  // Handle success message auto-hiding
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (saveStatus === 'success') {
      setStatusMessage('Changes saved successfully');
      // Auto-hide success message after 3 seconds
      timeout = setTimeout(() => {
        setStatusMessage(null);
        // Only hide the card if it's not dirty
        if (!isDirty) {
          setVisible(false);
        }
      }, 3000);
    } else if (saveStatus === 'error') {
      setStatusMessage(errorMessage || 'Failed to save changes');
    } else if (saveStatus === 'saving') {
      setStatusMessage('Saving changes...');
    } else {
      setStatusMessage(null);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [saveStatus, errorMessage, isDirty]);

  // For debugging
  useEffect(() => {
    console.log('FloatingActionCard state:', { isDirty, saveStatus, statusMessage });
  }, [isDirty, saveStatus, statusMessage]);

  if (!visible && !isDirty) {
    return null;
  }
  
  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50",
      className
    )}>
      <Card className={cn(
        "p-4 shadow-lg transition-all duration-300 ease-in-out",
        "transform translate-y-0 opacity-100",
        !visible && "transform translate-y-4 opacity-0 pointer-events-none"
      )}>
        <div className="flex items-center justify-between gap-4">
          {statusMessage && (
            <div className="flex items-center mr-2">
              {saveStatus === 'success' && (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              )}
              {saveStatus === 'error' && (
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              {saveStatus === 'saving' && (
                <Loader2 className="h-4 w-4 text-blue-500 mr-2 animate-spin" />
              )}
              <span className={cn(
                "text-sm font-medium",
                saveStatus === 'success' && "text-green-600",
                saveStatus === 'error' && "text-red-600",
                saveStatus === 'saving' && "text-blue-600"
              )}>
                {statusMessage}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {isDirty && (
              <>
                <Button
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isSaving}
                  className="h-8 px-3 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={onSave}
                  disabled={isSaving}
                  className="h-8 px-3 text-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 