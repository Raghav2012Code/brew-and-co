import React from 'react';

export const LogoMark = ({ className = 'w-9 h-9', showText = false, textClassName = '' }) => {
  return (
    <div className="inline-flex items-center gap-3 group">
      {/* Precision Vector Roastery Emblem */}
      <div className={`relative ${className} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
          aria-hidden="true"
        >
          {/* Outer Badge */}
          <rect
            width="64"
            height="64"
            rx="32"
            className="fill-[#1A1816] dark:fill-[#EAE6DF] transition-colors"
          />
          
          {/* Concentric Precision Rings */}
          <circle
            cx="32"
            cy="32"
            r="27"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2.5 2.5"
            className="text-[#EAE6DF]/40 dark:text-[#11100F]/40"
          />
          <circle
            cx="32"
            cy="32"
            r="24"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-[#EAE6DF]/90 dark:text-[#11100F]/90"
          />

          {/* Terracotta Roast Flame Dot */}
          <circle cx="32" cy="13.5" r="2.2" fill="#C84B31" />

          {/* Left Bean / 'B' Half */}
          <path
            d="M 27 20 C 19 23, 18 33, 23 40 C 27 46.5, 33 46, 31 42 C 29 38, 25 36, 27 30 C 29 24, 33 24, 32 20 C 31 18.5, 29 19, 27 20 Z"
            className="fill-[#EAE6DF] dark:fill-[#11100F] transition-colors"
          />

          {/* Right Bean / '&' Loop Half */}
          <path
            d="M 37 44 C 45 41, 46 31, 41 24 C 37 17.5, 31 18, 33 22 C 35 26, 39 28, 37 34 C 35 40, 31 40, 32 44 C 33 45.5, 35 45, 37 44 Z"
            className="fill-[#EAE6DF] dark:fill-[#11100F] transition-colors"
          />

          {/* Crease Curve */}
          <path
            d="M 32 18 Q 27.5 26, 34.5 32 T 32 46"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="text-[#1A1816] dark:text-[#EAE6DF] transition-colors"
          />

          {/* Center Roaster Spark */}
          <circle cx="33" cy="32" r="1.5" fill="#C84B31" />
        </svg>
      </div>

      {showText && (
        <div className={`text-left ${textClassName}`}>
          <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#1A1816] dark:text-[#EAE6DF] block leading-none">
            Brew & Co.
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-[#888276] dark:text-[#888276] block mt-0.5">
            Roastery & Cafe
          </span>
        </div>
      )}
    </div>
  );
};
