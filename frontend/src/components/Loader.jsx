import React from 'react';

export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={`${sizes[size]} border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[300px]">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-3 text-sm text-slate-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}
