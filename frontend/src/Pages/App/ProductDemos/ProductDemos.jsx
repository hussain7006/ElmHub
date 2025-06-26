import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useThemeStore from '../../../store/themeStore';
import useSearchStore from '../../../store/searchStore';

import { demos } from "../../../Constants/demos"
import Header from '../../../Components/App/ProductDemos/_components/Header'
import Gallery from '../../../Components/App/ProductDemos/_components/Gallery';

export default function DemoCenter() {
    const { colors } = useThemeStore();
    const { searchQuery, isFiltering, setIsFiltering } = useSearchStore();
    const navigate = useNavigate();
    const { demoType: routeDemoType } = useParams();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Get current product from URL
    const currentProductData = useMemo(() => {
        const product = demos[routeDemoType];
        if (!product) return null;

        return {
            product,
            productType: routeDemoType
        };
    }, [routeDemoType]);

    // Filter demos based on search query
    const filteredDemos = useMemo(() => {
        if (!currentProductData) return [];
        
        const { product } = currentProductData;
        const allDemos = Object.entries(product.demos);
        
        if (!isFiltering || !searchQuery.trim()) return allDemos;
        
        const searchTerm = searchQuery.toLowerCase().trim();
        return allDemos.filter(([demoKey, demo]) => {
            const nameMatch = demo.name.toLowerCase().includes(searchTerm);
            const descriptionMatch = demo.description.toLowerCase().includes(searchTerm);
            const subtitleMatch = demo.subtitle.toLowerCase().includes(searchTerm);
            const tagsMatch = demo.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const capabilitiesMatch = demo.capabilities.some(cap => cap.toLowerCase().includes(searchTerm));
            const featuresMatch = demo.features.some(feature => feature.toLowerCase().includes(searchTerm));
            
            return nameMatch || descriptionMatch || subtitleMatch || tagsMatch || capabilitiesMatch || featuresMatch;
        });
    }, [currentProductData, isFiltering, searchQuery]);

    // Register page search function - only when route changes
    useEffect(() => {
        const pagePath = `/demo/${routeDemoType}`;
        
        if (currentProductData) {
            const searchFunction = async (query) => {
                const { product } = currentProductData;
                const searchTerm = query.toLowerCase().trim();
                const results = [];
                
                Object.entries(product.demos).forEach(([demoKey, demo]) => {
                    const nameMatch = demo.name.toLowerCase().includes(searchTerm);
                    const descriptionMatch = demo.description.toLowerCase().includes(searchTerm);
                    const tagsMatch = demo.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                    const capabilitiesMatch = demo.capabilities.some(cap => cap.toLowerCase().includes(searchTerm));
                    
                    if (nameMatch || descriptionMatch || tagsMatch || capabilitiesMatch) {
                        results.push({
                            id: demo.id,
                            name: demo.name,
                            description: demo.description,
                            icon: product.icon,
                            color: product.color,
                            type: 'demo',
                            relevance: nameMatch ? 0 : (tagsMatch ? 1 : (capabilitiesMatch ? 2 : 3)),
                            path: `/demo/${product.id}#${demo.id}`,
                            section: `${product.title} Demos`,
                            parentProduct: product.title,
                            duration: demo.duration,
                            difficulty: demo.difficulty
                        });
                    }
                });
                
                return results.sort((a, b) => a.relevance - b.relevance);
            };

            useSearchStore.getState().registerPageSearch(pagePath, searchFunction);
            useSearchStore.getState().setCurrentPage(pagePath);
        }
        
        return () => {
            useSearchStore.getState().unregisterPageSearch(pagePath);
        };
    }, [routeDemoType, currentProductData]);

    // Set filtering state based on search query
    useEffect(() => {
        const hasSearchQuery = searchQuery.trim().length > 0;
        setIsFiltering(hasSearchQuery);
    }, [searchQuery, setIsFiltering]);

    // Fallback if no product found
    if (!currentProductData) {
        return (
            <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                        Product Not Found
                    </h1>
                    <p className="text-gray-600 mb-4">The requested product could not be found.</p>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="px-4 py-2 rounded-lg"
                        style={{ backgroundColor: colors.accent, color: 'white' }}
                    >
                        Back to Marketplace
                    </button>
                </div>
            </div>
        );
    }

    const { product } = currentProductData;

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6" style={{ backgroundColor: colors.background }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <Header
                    colors={colors}
                    product={product}
                />
                
                {/* Search Results Message */}
                {isFiltering && searchQuery.trim() && (
                    <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderColor}` }}>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                            {filteredDemos.length === 0 
                                ? `No demos found matching "${searchQuery}"`
                                : `Found ${filteredDemos.length} demo${filteredDemos.length === 1 ? '' : 's'} matching "${searchQuery}"`
                            }
                        </p>
                    </div>
                )}
                
                {/* Video Gallery */}
                <Gallery
                    colors={colors}
                    product={product}
                    selectedVideo={selectedVideo}
                    setSelectedVideo={setSelectedVideo}
                    availableDemos={filteredDemos}
                    isPlaying={isPlaying}
                    isMuted={isMuted}
                    togglePlay={togglePlay}
                    toggleMute={toggleMute}
                    containerVariants={containerVariants}
                    itemVariants={itemVariants}
                />

            </div>
        </div>
    );
} 