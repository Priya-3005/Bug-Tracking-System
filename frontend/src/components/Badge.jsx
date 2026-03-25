import React from 'react';
import { statusConfig, priorityConfig, severityConfig } from '../utils/helpers';

export function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.new;
  return (
    <span className={`badge ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] || priorityConfig.medium;
  return (
    <span className={`badge ${cfg.color}`}>
      <span className="text-[10px]">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const cfg = severityConfig[severity] || severityConfig.major;
  return <span className={`badge ${cfg.color}`}>{cfg.label}</span>;
}
