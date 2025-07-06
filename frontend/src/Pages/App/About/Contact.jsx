import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    EnvelopeIcon, 
    PhoneIcon, 
    MapPinIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    GlobeAltIcon,
    PaperAirplaneIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import useThemeStore from '../../../store/themeStore';

const Contact = () => {
    const { colors, theme } = useThemeStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const contactInfo = [
        {
            icon: EnvelopeIcon,
            title: "Email Us",
            value: "hello@elmhub.com",
            description: "We'll get back to you within 24 hours"
        },
        {
            icon: PhoneIcon,
            title: "Call Us",
            value: "+9666112887444",
            description: "Sun-Thur from 8am to 5pm KSA"
        },
        {
            icon: MapPinIcon,
            title: "Visit Us",
            value: "Riyadh, Saudi Arabia",
            description: "We are located in the heart of Riyadh"
        },
        {
            icon: ClockIcon,
            title: "Support Hours",
            value: "24/7 Available",
            description: "Round-the-clock technical support"
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                company: '',
                subject: '',
                message: ''
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            {/* Hero Section */}
            <motion.section 
                className="relative pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        variants={itemVariants}
                    >
                        <motion.h1 
                            className="text-4xl md:text-6xl font-bold mb-6"
                            style={{ color: colors.textPrimary }}
                        >
                            Get in Touch
                        </motion.h1>
                        <motion.p 
                            className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
                            style={{ color: colors.textSecondary }}
                        >
                            Have questions about our platform? We're here to help you succeed with AI-powered solutions.
                        </motion.p>
                    </motion.div>

                    {/* Contact Info Grid */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
                        variants={itemVariants}
                    >
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={info.title}
                                className="p-6 rounded-2xl text-center group"
                                style={{ 
                                    backgroundColor: colors.surface,
                                    border: `1px solid ${colors.borderColor}`
                                }}
                                whileHover={{ 
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <motion.div 
                                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${colors.primary}20` }}
                                    whileHover={{ 
                                        scale: 1.1,
                                        backgroundColor: `${colors.primary}30`
                                    }}
                                >
                                    <info.icon className="w-8 h-8" style={{ color: colors.primary }} />
                                </motion.div>
                                <motion.h3 
                                    className="text-lg font-semibold mb-2"
                                    style={{ color: colors.textPrimary }}
                                >
                                    {info.title}
                                </motion.h3>
                                <motion.p 
                                    className="text-lg font-medium mb-2"
                                    style={{ color: colors.primary }}
                                >
                                    {info.value}
                                </motion.p>
                                <motion.p 
                                    className="text-sm"
                                    style={{ color: colors.textSecondary }}
                                >
                                    {info.description}
                                </motion.p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Contact Form Section */}
            <motion.section 
                className="py-10 px-4 sm:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div 
                        className="grid lg:grid-cols-2 gap-12"
                        variants={itemVariants}
                    >
                        {/* Contact Form */}
                        <motion.div 
                            className="p-8 rounded-3xl"
                            style={{ 
                                backgroundColor: colors.surface,
                                border: `2px solid ${colors.borderColor}`
                            }}
                        >
                            <motion.h2 
                                className="text-3xl font-bold mb-6"
                                style={{ color: colors.textPrimary }}
                            >
                                Send us a Message
                            </motion.h2>
                            
                            {isSubmitted ? (
                                <motion.div 
                                    className="text-center py-12"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <CheckCircleIcon className="w-16 h-16 mx-auto mb-4" style={{ color: colors.primary }} />
                                    <h3 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                                        Message Sent!
                                    </h3>
                                    <p className="text-lg" style={{ color: colors.textSecondary }}>
                                        Thank you for reaching out. We'll get back to you soon.
                                    </p>
                                    <motion.button
                                        onClick={() => setIsSubmitted(false)}
                                        className="mt-6 px-6 py-3 rounded-xl font-semibold text-white"
                                        style={{ backgroundColor: colors.primary }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Send Another Message
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border transition-colors duration-300 focus:outline-none focus:ring-2"
                                                style={{ 
                                                    backgroundColor: colors.inputBackground,
                                                    borderColor: colors.borderColor,
                                                    color: colors.textPrimary
                                                }}
                                                placeholder="Your full name"
                                            />
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border transition-colors duration-300 focus:outline-none focus:ring-2"
                                                style={{ 
                                                    backgroundColor: colors.inputBackground,
                                                    borderColor: colors.borderColor,
                                                    color: colors.textPrimary
                                                }}
                                                placeholder="your.email@company.com"
                                            />
                                        </motion.div>
                                    </div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border transition-colors duration-300 focus:outline-none focus:ring-2"
                                            style={{ 
                                                backgroundColor: colors.inputBackground,
                                                borderColor: colors.borderColor,
                                                color: colors.textPrimary
                                            }}
                                            placeholder="Your company name"
                                        />
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border transition-colors duration-300 focus:outline-none focus:ring-2"
                                            style={{ 
                                                backgroundColor: colors.inputBackground,
                                                borderColor: colors.borderColor,
                                                color: colors.textPrimary
                                            }}
                                            placeholder="What can we help you with?"
                                        />
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-xl border transition-colors duration-300 focus:outline-none focus:ring-2 resize-none"
                                            style={{ 
                                                backgroundColor: colors.inputBackground,
                                                borderColor: colors.borderColor,
                                                color: colors.textPrimary
                                            }}
                                            placeholder="Tell us more about your needs..."
                                        />
                                    </motion.div>
                                    
                                    <motion.button
                                        type="submit"
                                        className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center space-x-2"
                                        style={{ backgroundColor: colors.primary }}
                                        whileHover={{ 
                                            scale: 1.02,
                                            boxShadow: `0 10px 25px ${colors.primary}40`
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                        <span>Send Message</span>
                                    </motion.button>
                                </form>
                            )}
                        </motion.div>

                        {/* Additional Info */}
                        <motion.div 
                            className="space-y-8"
                            variants={itemVariants}
                        >
                            <motion.div 
                                className="p-8 rounded-3xl"
                                style={{ 
                                    background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
                                    border: `2px solid ${colors.borderColor}`
                                }}
                            >
                                <motion.h3 
                                    className="text-2xl font-bold mb-4 flex items-center"
                                    style={{ color: colors.textPrimary }}
                                >
                                    <ChatBubbleLeftRightIcon className="w-8 h-8 mr-3" style={{ color: colors.primary }} />
                                    Live Chat Support
                                </motion.h3>
                                <motion.p 
                                    className="text-lg mb-6"
                                    style={{ color: colors.textSecondary }}
                                >
                                    Need immediate assistance? Our AI-powered chat support is available 24/7 to help you with any questions.
                                </motion.p>
                                <motion.button
                                    className="px-6 py-3 rounded-xl font-semibold text-white"
                                    style={{ backgroundColor: colors.accent }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Start Chat
                                </motion.button>
                            </motion.div>

                            <motion.div 
                                className="p-8 rounded-3xl"
                                style={{ 
                                    backgroundColor: colors.surface,
                                    border: `2px solid ${colors.borderColor}`
                                }}
                            >
                                <motion.h3 
                                    className="text-2xl font-bold mb-4 flex items-center"
                                    style={{ color: colors.textPrimary }}
                                >
                                    <GlobeAltIcon className="w-8 h-8 mr-3" style={{ color: colors.primary }} />
                                    Global Presence
                                </motion.h3>
                                <motion.p 
                                    className="text-lg mb-4"
                                    style={{ color: colors.textSecondary }}
                                >
                                    We serve customers worldwide with offices and support teams in multiple time zones.
                                </motion.p>
                                <motion.div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="font-semibold" style={{ color: colors.textPrimary }}>North America</div>
                                        <div style={{ color: colors.textSecondary }}>San Francisco, New York</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold" style={{ color: colors.textPrimary }}>Europe</div>
                                        <div style={{ color: colors.textSecondary }}>London, Berlin</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold" style={{ color: colors.textPrimary }}>Asia Pacific</div>
                                        <div style={{ color: colors.textSecondary }}>Singapore, Tokyo</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold" style={{ color: colors.textPrimary }}>Australia</div>
                                        <div style={{ color: colors.textSecondary }}>Sydney, Melbourne</div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default Contact; 