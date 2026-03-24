"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  className,
  children,
  ...props
}: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in zoom-in-95 fade-in",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const DialogHeader = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="mb-4 space-y-1.5" {...props} />
);

export const DialogTitle = (props: React.HTMLAttributes<HTMLHeadingElement>) => (
  <DialogPrimitive.Title className="text-lg font-semibold leading-none" {...props} />
);

export const DialogDescription = (props: React.HTMLAttributes<HTMLParagraphElement>) => (
  <DialogPrimitive.Description className="text-sm text-slate-500 dark:text-slate-400" {...props} />
);
