import * as React from "react";
import { ProductCard } from "./ProductCard";

interface Product {
  iconSrc: string;
  title: string;
  description: string;
  backgroundColor: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
}

export function ProductSection({ title, products }: ProductSectionProps) {
  return (
    <section className="mt-6 w-full max-md:max-w-full">
      <h2 className="text-xl font-semibold text-slate-700 max-md:max-w-full">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2 items-start mt-2 w-full max-md:max-w-full">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            iconSrc={product.iconSrc}
            title={product.title}
            description={product.description}
            backgroundColor={product.backgroundColor}
          />
        ))}
      </div>
    </section>
  );
}
