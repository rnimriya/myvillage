import React from 'react';

export default function MobileFrame({ children }) {
  return (
    <div className="min-h-screen min-h-dvh bg-panchayat-900 w-full flex items-center justify-center p-0 sm:p-6 md:p-12 overflow-hidden">
      <div className="relative w-full max-w-md h-dvh sm:h-[840px] bg-[#FFF8F0] sm:rounded-[50px] sm:shadow-[0_0_0_12px_var(--color-forest-teal-800),0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden sm:border-[4px] sm:border-panchayat-800">

        {/* Desktop mock speaker notch */}
        <div className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-forest-teal-950 rounded-b-2xl z-50 items-center justify-center">
          <div className="w-16 h-1.5 bg-forest-teal-800 rounded-full mb-1" />
          <div className="w-3 h-3 bg-forest-teal-950 rounded-full ml-3 mb-1 border border-forest-teal-800" />
        </div>

        {/* iOS notch safe area — real mobile only */}
        <div
          className="sm:hidden w-full shrink-0"
          style={{ height: 'env(safe-area-inset-top, 0px)', background: '#0F2234' }}
        />

        {/* App Content */}
        <div className="flex-1 flex flex-col bg-[#FFF8F0] overflow-hidden relative min-h-0">
          {children}
        </div>

        {/* Desktop home indicator */}
        <div className="hidden sm:flex w-full bg-white py-3 justify-center z-40 border-t border-gray-100">
          <div className="w-36 h-1.5 bg-gray-300 rounded-full active-press cursor-pointer hover:bg-gray-400" />
        </div>
      </div>
    </div>
  );
}
