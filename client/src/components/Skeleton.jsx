/**
 * Skeleton Loader Components - Better loading states
 */

// Base skeleton with shimmer animation
const SkeletonBase = ({ className = '' }) => (
  <div className={`bg-gray-200 dark:bg-gray-700 animate-shimmer rounded ${className}`} />
);

// Product card skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
    <SkeletonBase className="w-full h-48" />
    <div className="p-4 space-y-3">
      <SkeletonBase className="h-4 w-3/4" />
      <SkeletonBase className="h-4 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <SkeletonBase className="h-6 w-20" />
        <SkeletonBase className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

// Product grid skeleton
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// Table row skeleton
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <SkeletonBase className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Table skeleton
export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-4 py-3 text-left">
              <SkeletonBase className="h-4 w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

// Card skeleton
export const CardSkeleton = ({ lines = 3 }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
    <SkeletonBase className="h-6 w-1/3" />
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase key={i} className="h-4 w-full" style={{ width: `${100 - i * 15}%` }} />
    ))}
  </div>
);

// Profile skeleton
export const ProfileSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
    <div className="flex items-center gap-4 mb-6">
      <SkeletonBase className="w-20 h-20 rounded-full" />
      <div className="space-y-2">
        <SkeletonBase className="h-6 w-32" />
        <SkeletonBase className="h-4 w-48" />
      </div>
    </div>
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <SkeletonBase className="h-4 w-24" />
          <SkeletonBase className="h-4 w-32" />
        </div>
      ))}
    </div>
  </div>
);

// Order card skeleton
export const OrderCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <SkeletonBase className="h-5 w-32" />
        <SkeletonBase className="h-4 w-24" />
      </div>
      <SkeletonBase className="h-8 w-20 rounded-full" />
    </div>
    <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <SkeletonBase className="h-4 w-40" />
          <SkeletonBase className="h-4 w-16" />
        </div>
      ))}
    </div>
  </div>
);

// Stats card skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonBase className="h-4 w-20" />
        <SkeletonBase className="h-8 w-24" />
      </div>
      <SkeletonBase className="w-12 h-12 rounded-lg" />
    </div>
  </div>
);

// Dashboard skeleton
export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardSkeleton lines={5} />
      <CardSkeleton lines={5} />
    </div>
  </div>
);

// Text skeleton
export const TextSkeleton = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase 
        key={i} 
        className="h-4" 
        style={{ width: i === lines - 1 ? '60%' : '100%' }} 
      />
    ))}
  </div>
);

// Image skeleton
export const ImageSkeleton = ({ className = 'w-full h-48' }) => (
  <SkeletonBase className={className} />
);

export default {
  ProductCardSkeleton,
  ProductGridSkeleton,
  TableSkeleton,
  TableRowSkeleton,
  CardSkeleton,
  ProfileSkeleton,
  OrderCardSkeleton,
  StatsCardSkeleton,
  DashboardSkeleton,
  TextSkeleton,
  ImageSkeleton
};
