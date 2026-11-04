import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-slate-900 text-white hover:bg-slate-800',
  outline: 'border border-slate-300 bg-white hover:bg-slate-50',
  ghost: 'hover:bg-slate-100',
};

type ButtonProps = React.ComponentProps<'button'> & {
  asChild?: boolean;
  variant?: keyof typeof variants;
};

export function Button({ className, variant = 'default', asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
