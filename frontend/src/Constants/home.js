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

export const speechProducts = [
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

export const visionProducts = [
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

export const llmProducts = [
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

export const insightProducts = [
    {
        icon: ChartBarIcon,
        title: "Advanced Analytics Dashboard",
        description: "Convert your voice to text easily with our speech-to-text AI, enhancing productivity.",
        isEnabled: true
    }
];