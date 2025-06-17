import * as React from "react";
import { Header } from "./Header";
import { ProductSection } from "./ProductSection";

export function MainContent() {
  const speechProducts = [
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/c3e811beef622112e3adcc36c2573d0377185cf6?placeholderIfAbsent=true",
      title: "Speech to Text",
      description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity!",
      backgroundColor: "bg-fuchsia-700"
    },
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/894164ba13c16d625626b718a9d95da9ab6c0610?placeholderIfAbsent=true",
      title: "Text to Speech",
      description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity!",
      backgroundColor: "bg-fuchsia-600"
    },
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/2fc3c857f31155df218824530de74b187c11a976?placeholderIfAbsent=true",
      title: "Sentiment of Voice Calls",
      description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity!",
      backgroundColor: "bg-fuchsia-300"
    }
  ];

  const visionProducts = [
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/3c2c7d65c2114c363187cc36d9a557f03e1e9ff6?placeholderIfAbsent=true",
      title: "Crowd Detection",
      description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity!",
      backgroundColor: "bg-blue-800"
    },
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/21b39f59b1da3cef3b42e890222ddad936c03b7f?placeholderIfAbsent=true",
      title: "Surveillance Camera Detection",
      description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity!",
      backgroundColor: "bg-blue-500"
    },
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/2c61bfcb2a7fbfd222e10cd3989c51db4494577e?placeholderIfAbsent=true",
      title: "Speech to Text",
      description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity!",
      backgroundColor: "bg-blue-400"
    }
  ];

  const llmProducts = [
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/16218424f9b5061440c7e2491446b5a8db42376a?placeholderIfAbsent=true",
      title: "Nuha",
      description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity!",
      backgroundColor: "bg-orange-500"
    },
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/fefc8e86c345c69724cee737e2c1d30cf67656df?placeholderIfAbsent=true",
      title: "Nuha Avatar",
      description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity!",
      backgroundColor: "bg-orange-300"
    }
  ];

  const insightsProducts = [
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/1994f5abc2c7c4b52293ccbd37f1a54e20034748?placeholderIfAbsent=true",
      title: "Advanced Analytics Dashboards",
      description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity!",
      backgroundColor: "bg-emerald-500"
    }
  ];

  return (
    <main className="grow shrink min-w-60 w-[1198px] max-md:max-w-full">
      <Header />

      <div className="overflow-hidden flex-1 px-3 py-6 mt-2.5 w-full max-md:max-w-full">
        <div className="flex flex-wrap gap-2.5 justify-center items-center w-full text-3xl font-bold text-slate-700 max-md:max-w-full">
          <span className="self-stretch my-auto text-slate-700">
            Explore
          </span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/9c903654d053a21353d017082c0cea2c64e64f3c?placeholderIfAbsent=true"
            className="object-contain shrink-0 self-stretch my-auto aspect-[2.48] w-[67px]"
            alt="Logo"
          />
          <span className="self-stretch my-auto text-slate-700">
            's
          </span>
          <span className="self-stretch my-auto text-slate-700">
            {" "}AI Solutions Marketplace
          </span>
        </div>

        <ProductSection title="Speech Related" products={speechProducts} />

        <section className="mt-6 w-full max-md:max-w-full">
          <h2 className="text-xl font-semibold text-slate-700 max-md:max-w-full">
            Computer Vision
          </h2>
          <div className="flex flex-wrap gap-2 items-start mt-2 w-full max-md:max-w-full">
            {visionProducts.map((product, index) => (
              <article key={index} className="flex overflow-hidden flex-1 shrink gap-4 items-center p-4 bg-white rounded-xl shadow basis-0 min-w-60">
                <div className={`flex flex-col justify-center items-center self-stretch my-auto w-14 h-14 ${product.backgroundColor} rounded-md min-h-14`}>
                  <img
                    src={product.iconSrc}
                    className="object-contain w-7 h-7 aspect-square"
                    alt=""
                  />
                </div>
                <div className="flex-1 shrink self-stretch my-auto basis-0 min-w-60">
                  <h3 className="text-lg font-medium leading-none text-slate-700">
                    {product.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-500">
                    {product.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <div className="flex gap-2 items-start mt-2 w-full max-md:max-w-full">
            <article className="flex overflow-hidden gap-4 items-center p-4 bg-white rounded-xl shadow min-w-60 w-[403px]">
              <div className="flex flex-col justify-center items-center self-stretch my-auto w-14 h-14 bg-blue-300 rounded-md min-h-14">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/efb56b062c771b049a418b2f6b78c139045c6d56?placeholderIfAbsent=true"
                  className="object-contain w-7 h-7 aspect-square"
                  alt=""
                />
              </div>
              <div className="flex-1 shrink self-stretch my-auto basis-0 min-w-60">
                <h3 className="text-lg font-medium leading-none text-slate-700">
                  Object Detection
                </h3>
                <p className="mt-2.5 text-sm text-slate-500">
                  Convert your voice to text easily with our speech-to-text AI, enhancing productivity!
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-6 w-full max-md:max-w-full">
          <h2 className="text-xl font-semibold text-slate-700 max-md:max-w-full">
            Large Language Models (LLM)
          </h2>
          <div className="flex flex-wrap gap-2 items-start mt-2 w-full max-md:max-w-full">
            {llmProducts.map((product, index) => (
              <article key={index} className="flex overflow-hidden gap-4 items-center p-4 bg-white rounded-xl shadow min-w-60 w-[403px]">
                <div className={`flex flex-col justify-center items-center self-stretch my-auto w-14 h-14 ${product.backgroundColor} rounded-md min-h-14`}>
                  <img
                    src={product.iconSrc}
                    className="object-contain w-7 h-7 aspect-square"
                    alt=""
                  />
                </div>
                <div className="flex-1 shrink self-stretch my-auto basis-0 min-w-60">
                  <h3 className="text-lg font-medium leading-none text-slate-700">
                    {product.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-500">
                    {product.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 w-full max-md:max-w-full">
          <h2 className="text-xl font-semibold text-slate-700 max-md:max-w-full">
            Insights
          </h2>
          <div className="flex gap-2 items-start mt-2 w-full max-md:max-w-full">
            <article className="flex overflow-hidden gap-4 items-center p-4 bg-white rounded-xl shadow min-w-60 w-[403px]">
              <div className="flex flex-col justify-center items-center self-stretch my-auto w-14 h-14 bg-emerald-500 rounded-md min-h-14">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/1994f5abc2c7c4b52293ccbd37f1a54e20034748?placeholderIfAbsent=true"
                  className="object-contain w-7 h-7 aspect-square"
                  alt=""
                />
              </div>
              <div className="flex-1 shrink self-stretch my-auto basis-0 min-w-60">
                <h3 className="text-lg font-medium leading-none text-slate-700">
                  Advanced Analytics Dashboards
                </h3>
                <p className="mt-2.5 text-sm text-slate-500">
                  Convert your voice to text easily with our speech-to-text AI, enhancing productivity!
                </p>
              </div>
            </article>
          </div>
        </section>

        <div className="mt-6 w-full text-xl font-semibold whitespace-nowrap text-slate-700 max-md:max-w-full">
          Insights
        </div>
      </div>
    </main>
  );
}
