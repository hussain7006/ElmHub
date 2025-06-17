import * as React from "react";

interface AvatarProps {
  initials: string;
  badgeCount?: number;
}

export function Avatar({ initials, badgeCount }: AvatarProps) {
  return (
    <div className="flex relative flex-col justify-center items-center self-stretch my-auto whitespace-nowrap rounded-3xl bg-slate-200 h-[42px] min-h-[42px] w-[42px]">
      <div className="z-0 self-center text-xl text-slate-700">
        {initials}
      </div>
      {badgeCount && (
        <div className="flex justify-center items-center absolute -right-2.5 z-0 text-xs font-bold leading-5 text-white bg-emerald-500 rounded-xl border-2 border-solid border-[color:var(--overlaybadge-outline-color,#FFF)] h-[21px] min-h-[21px] min-w-[21px] top-[-11px] w-[21px]">
          {badgeCount}
        </div>
      )}
    </div>
  );
}