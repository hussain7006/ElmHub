import * as React from "react";
import { SearchInput } from "./SearchInput";
import { Avatar } from "./Avatar";

export function Header() {
  return (
    <header className="flex overflow-hidden flex-col justify-center p-4 w-full bg-white rounded shadow max-md:max-w-full">
      <div className="flex flex-col gap-3 justify-center w-full max-md:max-w-full">
        <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
          <h1 className="self-stretch my-auto text-lg font-medium text-slate-500">
            Marketplace
          </h1>
          <div className="flex gap-3 items-center self-stretch px-6 my-auto min-w-60 max-md:px-5">
            <SearchInput
              iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/7ec6336f54ee50ac23e4928884f37d7cc3afb70a?placeholderIfAbsent=true"
              className="self-stretch my-auto w-[216px]"
            />
            <button className="flex justify-center items-center self-stretch px-0 py-0 my-auto bg-emerald-500 rounded-3xl border border-solid border-[color:var(--button-primary-border-color,#10B981)] h-[42px] min-h-[42px] w-[42px]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/1adf05369d25444fd6be0e11387e67c6b82cb9c3?placeholderIfAbsent=true"
                className="object-contain self-stretch my-auto w-4 h-4 aspect-square"
                alt="Add"
              />
            </button>
            <Avatar initials="AB" badgeCount={8} />
          </div>
        </div>
        <h2 className="mt-3 text-xl font-bold text-slate-700">
          Good Morning, username!
        </h2>
        <nav className="flex flex-wrap gap-2 items-center p-3.5 mt-3 w-full bg-white rounded-md max-md:max-w-full">
          <div className="flex gap-2.5 items-start self-stretch my-auto w-3.5">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/60a5123307d11cdd8232b2196560aeab70fb645b?placeholderIfAbsent=true"
              className="object-contain w-3.5 aspect-square"
              alt="Home"
            />
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/e114b1972514c7546f6220f5fe15bfc56ccf1a5b?placeholderIfAbsent=true"
            className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
            alt="Separator"
          />
          <div className="gap-2 self-stretch my-auto text-sm leading-none whitespace-nowrap text-slate-500">
            Marketplace
          </div>
        </nav>
      </div>
    </header>
  );
}