import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductSection = ({ title, products, colors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h2 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div key={index} id={`${title.replace(/\s+/g, '-')}-${index}`}>
            <ProductCard
              icon={product.icon}
              title={product.title}
              description={product.description}
              colors={colors}
              isEnabled={product.isEnabled}
              section={title}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductSection; 