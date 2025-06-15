import React from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../../../store/themeStore';
import {
    MicrophoneIcon,
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    UserGroupIcon,
    VideoCameraIcon,
    ViewfinderCircleIcon,
    CpuChipIcon,
    CubeIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import ProductSection from '../../../Components/App/Marketplace/ProductSection';

const Marketplace = () => {
    const { colors } = useThemeStore();

    const speechProducts = [
        {
            icon: MicrophoneIcon,
            title: "Speech to Text",
            description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity.",
            isEnabled: false
        },
        {
            icon: DocumentTextIcon,
            title: "Text to Speech",
            description: "Transform written text into natural-sounding speech with our advanced AI technology.",
            isEnabled: true
        },
        {
            icon: ChatBubbleLeftRightIcon,
            title: "Voice Translation",
            description: "Real-time voice translation across multiple languages powered by AI.",
            isEnabled: true
        }
    ];

    const visionProducts = [
        {
            icon: UserGroupIcon,
            title: "Crowd Detection",
            description: "Advanced AI system for real-time crowd analysis and density monitoring in public spaces.",
            isEnabled: true
        },
        {
            icon: VideoCameraIcon,
            title: "Surveillance Camera Detection",
            description: "Intelligent system to detect and analyze surveillance cameras in any environment.",
            isEnabled: true
        },
        {
            icon: ViewfinderCircleIcon,
            title: "Object Detection",
            description: "State-of-the-art object detection and recognition system for various applications.",
            isEnabled: false
        }
    ];

    const llmProducts = [
        {
            icon: CpuChipIcon,
            title: "Nuha with AI chip",
            description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity.",
            isEnabled: true
        },
        {
            icon: CubeIcon,
            title: "Nuha avatar",
            descrdescription: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity.",
            isEnabled: true
        }
    ];

    const insightProducts = [
        {
            icon: ChartBarIcon,
            title: "Advanced Analytics Dashboard",
            description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity.",
            isEnabled: true
        }
    ];

    return (
        <div className="p-6 ">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold mb-8 text-center"
                style={{ color: colors.textPrimary }}
            >
                Explore <span style={{ color: colors.accent, fontFamily: 'WDXL Lubrifont TC', fontSize: '2.5rem' }}>elm</span>'s AI Solution Marketplace
            </motion.h1>

            <div className="space-y-8">
                <ProductSection
                    title="Speech Related"
                    products={speechProducts}
                    colors={colors}
                />

                <ProductSection
                    title="Computer Vision Related"
                    products={visionProducts}
                    colors={colors}
                />

                <ProductSection
                    title="Large Language Models (LLM)"
                    products={llmProducts}
                    colors={colors}
                />

                <ProductSection
                    title="Insight Related"
                    products={insightProducts}
                    colors={colors}
                />
            </div>
        </div>
    );
};

export default Marketplace; 