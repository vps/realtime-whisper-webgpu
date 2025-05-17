import React from 'react';

export function OfflineToggle({ offlineMode, onToggle, disabled }) {
  return (
    <label className="flex items-center space-x-2 text-xs sm:text-sm">
      <input
        type="checkbox"
        checked={offlineMode}
        onChange={onToggle}
        disabled={disabled}
        className="form-checkbox h-4 w-4"
      />
      <span>Offline Mode</span>
    </label>
  );
}
