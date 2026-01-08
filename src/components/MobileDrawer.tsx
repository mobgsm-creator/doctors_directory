"use client";

import { ReactNode } from "react";

interface MobileDrawerProps {
  children: ReactNode;
  onClose: () => void;
}

export function MobileDrawer({ children, onClose }: MobileDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          ✕
        </button>
      </div>
      <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
        {children}
      </div>
    </div>
  );
}