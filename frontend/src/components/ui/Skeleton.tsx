import React from "react";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = "h-4 w-full", count = 1 }: SkeletonProps) {
  if (count === 1) {
    return (
      <div
        className={`animate-pulse rounded bg-[#171D24] border border-[#1C242C] ${className}`}
      />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded bg-[#171D24] border border-[#1C242C] ${className}`}
        />
      ))}
    </div>
  );
}
