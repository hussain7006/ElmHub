import * as React from "react";

interface ProductCardProps {
  iconSrc: string;
  title: string;
  description: string;
  backgroundColor: string;
}

export function ProductCard({ iconSrc, title, description, backgroundColor }: ProductCardProps) {
  return (
    <article className="flex overflow-hidden flex-1 shrink gap-4 items-center p-4 bg-white rounded-xl shadow basis-0 min-w-60">
      <div className={`flex flex-col justify-center items-center self-stretch my-auto w-14 h-14 ${backgroundColor} rounded-md min-h-14`}>
        <img
          src={iconSrc}
          className="object-contain w-7 h-7 aspect-square"
          alt=""
        />
      </div>
      <div className="flex-1 shrink self-stretch my-auto basis-0 min-w-60">
        <h3 className="text-lg font-medium leading-none text-slate-700">
          {title}
        </h3>
        <p className="mt-2.5 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </article>
  );
}