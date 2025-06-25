import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useThemeStore from '../../../store/themeStore';

import { demos } from "../../../Constants/demos"
import Header from '../../../Components/App/ProductDemos/_components/Header'
import Gallery from '../../../Components/App/ProductDemos/_components/Gallery';

export default function DemoCenter() {
    const { colors } = useThemeStore();
    const navigate = useNavigate();
    const { demoType: routeDemoType } = useParams();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Get current product from URL
    const getCurrentProduct = () => {
        const product = demos[routeDemoType];
        if (!product) return null;

        return {
            product,
            productType: routeDemoType
        };
    };

    const currentProductData = getCurrentProduct();

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
    const availableDemos = Object.entries(product.demos);

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
                {/* Video Gallery */}
                <Gallery
                    colors={colors}
                    product={product}
                    selectedVideo={selectedVideo}
                    setSelectedVideo={setSelectedVideo}
                    availableDemos={availableDemos}
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