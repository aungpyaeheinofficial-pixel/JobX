import React from 'react';

/**
 * Loading Skeleton Components
 * Show while content is loading for better perceived performance
 */

// Base Skeleton Component
export const Skeleton = ({ className = '', width, height }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
};

// Post Card Skeleton
export const PostSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-gray-100">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
};

// Job Card Skeleton
export const JobCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
};

// Profile Card Skeleton
export const ProfileCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-full" />
    </div>
  );
};

// Feed Loading State
export const FeedLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
};

// Jobs Loading State
export const JobsLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
      <JobCardSkeleton />
    </div>
  );
};

// Network Loading State
export const NetworkLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProfileCardSkeleton />
      <ProfileCardSkeleton />
      <ProfileCardSkeleton />
      <ProfileCardSkeleton />
      <ProfileCardSkeleton />
      <ProfileCardSkeleton />
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4 }) => {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4" />
        </td>
      ))}
    </tr>
  );
};

// Button Loading State
export const ButtonLoader = () => {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Add shimmer animation to global CSS
export const shimmerAnimation = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`;

export default Skeleton;
