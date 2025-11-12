import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          {[...Array(columns)].map((_, j) => (
            <Skeleton key={j} height={40} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
      <Skeleton height={24} width={150} className="mb-2" />
      <Skeleton height={32} width={100} className="mb-4" />
      <Skeleton count={2} height={16} />
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <Skeleton circle width={48} height={48} />
        <Skeleton width={60} height={20} />
      </div>
      <Skeleton height={32} width={100} className="mb-2" />
      <Skeleton height={16} width={120} />
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton circle width={80} height={80} />
        <div className="flex-1">
          <Skeleton height={24} width={200} className="mb-2" />
          <Skeleton height={16} width={150} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <Skeleton height={16} width={100} className="mb-2" />
            <Skeleton height={40} />
          </div>
        ))}
      </div>
    </div>
  );
};
