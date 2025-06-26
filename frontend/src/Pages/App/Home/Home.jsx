import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../../store/themeStore';

import ProductSection from '../../../Components/App/Products/Home/ProductSection';
import { speechProducts, visionProducts, llmProducts, insightProducts } from '../../../Constants/home';
import usePageSearch from '../../../hooks/usePageSearch';
import useSearchStore from '../../../store/searchStore';

const Marketplace = () => {
    const { colors } = useThemeStore();

    // Page-specific search function
    const searchHomePage = useCallback(async (query) => {
        const searchTerm = query.toLowerCase().trim();
        const results = [];
        const searchProducts = (products, category) => {
            products.forEach((product, index) => {
                const titleMatch = product.title.toLowerCase().includes(searchTerm);
                const descriptionMatch = product.description?.toLowerCase().includes(searchTerm);
                if (titleMatch || descriptionMatch) {
                    results.push({
                        id: `${category}-${index}`,
                        name: product.title,
                        description: product.description,
                        icon: product.icon,
                        type: 'product',
                        relevance: titleMatch ? 0 : 1,
                        path: `/#${category}-${index}`,
                        section: category,
                        isEnabled: product.isEnabled
                    });
                }
            });
        };
        searchProducts(speechProducts, 'Speech Related');
        searchProducts(visionProducts, 'Computer Vision Related');
        searchProducts(llmProducts, 'Large Language Models (LLM)');
        searchProducts(insightProducts, 'Insight Related');
        return results.sort((a, b) => a.relevance - b.relevance);
    }, []);
    usePageSearch(searchHomePage);

    // Filter products based on search
    const { searchQuery, isFiltering } = useSearchStore();
    const filterProducts = useCallback((products) => {
        if (!isFiltering || !searchQuery.trim()) return products;
        const searchTerm = searchQuery.toLowerCase().trim();
        return products.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm))
        );
    }, [isFiltering, searchQuery]);

    // Only include sections with at least one matching product
    const filteredSections = useMemo(() => [
        {
            title: 'Speech Related',
            products: filterProducts(speechProducts)
        },
        {
            title: 'Computer Vision Related',
            products: filterProducts(visionProducts)
        },
        {
            title: 'Large Language Models (LLM)',
            products: filterProducts(llmProducts)
        },
        {
            title: 'Insight Related',
            products: filterProducts(insightProducts)
        }
    ].filter(section => section.products.length > 0), [filterProducts]);

    return (
        <div className="p-6 ">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold mb-8 text-center"
            >
                <div className="flex flex-wrap gap-2.5 justify-center items-center w-full text-3xl font-bold  max-md:max-w-full">
                    <span className="self-stretch my-auto"
                        style={{ color: colors.textPrimary }}
                    >
                        Explore
                    </span>
                    <img
                        src="https://cdn.builder.io/api/v1/image/assets/a13b0fc47a26423f9462e4bb1b87e766/9c903654d053a21353d017082c0cea2c64e64f3c?placeholderIfAbsent=true"
                        className="object-contain shrink-0 self-stretch my-auto aspect-[2.48] w-[67px]"
                        alt="Logo"
                    />
                    <span className="self-stretch my-auto "
                        style={{ color: colors.textPrimary }}>
                        's
                    </span>
                    <span className="self-stretch my-auto "
                        style={{ color: colors.textPrimary }}>
                        {" "}AI Solutions Marketplace
                    </span>
                </div>
            </motion.h1>
            <div className="space-y-8">
                {filteredSections.map(section => (
                    <ProductSection
                        key={section.title}
                        title={section.title}
                        products={section.products}
                        colors={colors}
                    />
                ))}
            </div>
        </div>
    );
};

export default Marketplace; 