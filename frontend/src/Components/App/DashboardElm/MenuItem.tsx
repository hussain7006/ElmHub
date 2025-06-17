import * as React from "react";

interface MenuItemProps {
  iconSrc: string;
  label: string;
  isActive?: boolean;
}

export function MenuItem({ iconSrc, label, isActive = false }: MenuItemProps) {
  const baseClasses = "flex gap-2 items-center py-2 pr-2.5 pl-3 mt-2 w-full rounded";
  const activeClasses = "bg-slate-100 text-slate-800";
  const inactiveClasses = "text-slate-700";

  return (
    <div className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      <img
        src={iconSrc}
        className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
        alt=""
      />
      <div className="flex-1 shrink self-stretch my-auto basis-0">
        {label}
      </div>
    </div>
  );
}
