import * as React from "react";

interface SearchInputProps {
  placeholder?: string;
  iconSrc: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Search for any content...",
  iconSrc,
  className = ""
}: SearchInputProps) {
  return (
    <div className={`text-xs text-slate-500 ${className}`}>
      <div className="w-full">
        <div className="flex gap-2.5 items-center p-2 w-full rounded-md border border-solid shadow-sm bg-[#FFF;}] border-[color:var(--inputtext-border-color,#CBD5E1)] pl-[var(--inputtext-padding-x,] pr-[var(--inputtext-padding-x,]">
          <div className="flex-1 shrink self-stretch my-auto basis-0">
            <div className="overflow-hidden flex-1 shrink w-full text-xs basis-0 text-ellipsis text-slate-500">
              {placeholder}
            </div>
          </div>
          <img
            src={iconSrc}
            className="object-contain shrink-0 self-stretch my-auto w-3 h-3 aspect-square"
            alt="Search"
          />
        </div>
      </div>
    </div>
  );
}