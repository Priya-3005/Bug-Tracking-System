import React from 'react';
import { Bug } from 'lucide-react';

export default function EmptyState({ title = 'No bugs found', description = 'No items match your current filters.', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Bug size={28} className="text-slate-300" />
      </div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}
