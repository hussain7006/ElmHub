import * as React from "react";
import { SearchInput } from "./SearchInput";
import { MenuItem } from "./MenuItem";

export function Sidebar() {
  return (
    <aside className="overflow-hidden grow shrink p-4 bg-white shadow-sm min-w-60 w-[200px]">
      <header className="flex gap-10 justify-between items-center py-3 w-full">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/cc3b2acc90d1d0ea18130f9ea1b70caaaaab9703?placeholderIfAbsent=true"
          className="object-contain shrink-0 self-stretch my-auto aspect-[2.53] w-[101px]"
          alt="Logo"
        />
        <div className="flex gap-2 justify-center items-center self-stretch p-1 my-auto rounded-md border border-solid bg-slate-100 border-[color:var(--togglebutton-border-color,#F1F5F9)]">
          <div className="flex justify-center items-center self-stretch px-2.5 py-1 my-auto rounded-md w-[33px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/c3ce8767bd85c4a8451db31155f190f32e77dfd8?placeholderIfAbsent=true"
              className="object-contain self-stretch my-auto w-3 h-3 aspect-square"
              alt="Toggle"
            />
          </div>
        </div>
      </header>

      <nav className="flex-1 gap-0.5 py-1 pr-1 pl-1 mt-2.5 w-full text-sm leading-none text-slate-700">
        <div className="gap-2 py-5 w-full">
          <h3 className="flex-1 shrink gap-2 py-2 pr-2.5 pl-3 w-full font-semibold whitespace-nowrap basis-0 bg-black bg-opacity-0 text-slate-500">
            Products
          </h3>

          <SearchInput iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/39f2e13e96486e68d2d9b8d6edb36ef48367b4de?placeholderIfAbsent=true" className="mt-2 w-full" />

          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/87ec7ddda497b395b170c71b529578db53f5d80d?placeholderIfAbsent=true" label="Baleeg - Speech to Text" isActive />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/4362b49b2609599d231350a0912a54c21e7a131a?placeholderIfAbsent=true" label="Nuha - LLM" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/8ef7a5a3f03c00b4e2b70dcec99c2eedbca9fa44?placeholderIfAbsent=true" label="Sentiment Analysis" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/321efabfe0d4eff4eb06f5504a01ed546bd8fcbf?placeholderIfAbsent=true" label="Video Enhancement" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/6eb0ad77463363b95c69393adeb06f82698229c0?placeholderIfAbsent=true" label="Product name 1" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/b2e84da80b2728266310f350351eeb5b3215f6ec?placeholderIfAbsent=true" label="Product name 2" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/47429d74792ec328e998b59a0a0eb7c649e27061?placeholderIfAbsent=true" label="Product name 3" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/44a2f52bb690ebee9bcebcf3650d04d24151ab89?placeholderIfAbsent=true" label="Product name 4" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/c70125727b2a35e101a7d27852f42c14e64d7de2?placeholderIfAbsent=true" label="Product name 5" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/80dd20b23b3fe51643f07cb8ce153f170f097a61?placeholderIfAbsent=true" label="Product name 6" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/ddd420cd0d92e014fddc033303c2b538ab6774a2?placeholderIfAbsent=true" label="Product name 7" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/882be1e31fe320a078e49e2062d0b86f580fdbd8?placeholderIfAbsent=true" label="Product name 8" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/199cee922a16c9efea70170984d185a4fc5adc9b?placeholderIfAbsent=true" label="Product name 9" />
          <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/6daa8aa61d066cc7c51f9f7b7f35c322363bc5e3?placeholderIfAbsent=true" label="Product name 10" />
        </div>

        <h3 className="flex-1 shrink gap-2 py-2 pr-2.5 pl-3 w-full font-semibold whitespace-nowrap basis-0 bg-black bg-opacity-0 text-slate-500">
          Settings
        </h3>
        <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/db56161d0f90d6229a68117a0b8b4dc8b3385fd9?placeholderIfAbsent=true" label="User Management" />
        <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/dd4d856e1e071b9164fbe4c57a6e54c9968de79f?placeholderIfAbsent=true" label="Data Resources" />

        <h3 className="flex-1 shrink gap-2 py-2 pr-2.5 pl-3 w-full font-semibold basis-0 bg-black bg-opacity-0 text-slate-500">
          Analytics Dashboard
        </h3>
        <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/72fc24bbfe8c8a9a04f938dc38361ba0bb139072?placeholderIfAbsent=true" label="Notifications" />
        <MenuItem iconSrc="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/4837a0e41b62b2ba2a04b7f222dc32efe216c741?placeholderIfAbsent=true" label="API Management" />
      </nav>
    </aside>
  );
}
