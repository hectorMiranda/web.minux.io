'use client';

import { Switch } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface SecurityToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description: string;
}

export function SecurityToggle({ enabled, onChange, label, description }: SecurityToggleProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-0.5">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          enabled ? 'bg-primary' : 'bg-white/10'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            enabled ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </Switch>
    </div>
  );
} 