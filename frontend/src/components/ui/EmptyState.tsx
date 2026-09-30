import React from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`p-12 rounded-lg border border-dashed border-[#25303C] bg-[#101720]/50 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8 ${className}`}
    >
      <div className="w-12 h-12 rounded-lg bg-[#151D27] border border-[#25303C] flex items-center justify-center text-[#39D9FF] mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#F5F7FA] font-heading">
        {title}
      </h3>
      <p className="mt-1.5 text-xs text-[#A4AFBC] max-w-sm leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
}
