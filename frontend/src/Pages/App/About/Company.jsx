import React from 'react';
import { motion } from 'framer-motion';
import { 
    BuildingOffice2Icon, 
    UsersIcon, 
    LightBulbIcon, 
    GlobeAltIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    RocketLaunchIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import useThemeStore from '../../../store/themeStore';

const Company = () => {
    const { colors, theme } = useThemeStore();

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

    const stats = [
        { icon: UsersIcon, value: "500+", label: "Team Members", color: "from-blue-500 to-cyan-500" },
        { icon: GlobeAltIcon, value: "50+", label: "Countries", color: "from-green-500 to-emerald-500" },
        { icon: ChartBarIcon, value: "99.9%", label: "Uptime", color: "from-purple-500 to-pink-500" },
        { icon: RocketLaunchIcon, value: "10M+", label: "Users Served", color: "from-orange-500 to-red-500" }
    ];

    const values = [
        {
            icon: LightBulbIcon,
            title: "Innovation",
            description: "We constantly push the boundaries of what's possible in AI and machine learning, creating solutions that transform industries."
        },
        {
            icon: ShieldCheckIcon,
            title: "Trust & Security",
            description: "Your data security is our top priority. We implement enterprise-grade security measures to protect your information."
        },
        {
            icon: HeartIcon,
            title: "Customer Success",
            description: "We're committed to your success. Our team works tirelessly to ensure you achieve your goals with our platform."
        },
        {
            icon: UsersIcon,
            title: "Collaboration",
            description: "We believe in the power of teamwork and partnerships to create solutions that benefit everyone."
        }
    ];

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
                            About Our Company
                        </motion.h1>
                        <motion.p 
                            className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
                            style={{ color: colors.textSecondary }}
                        >
                            We're a team of innovators, engineers, and visionaries dedicated to transforming the future through cutting-edge AI technology.
                        </motion.p>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
                        variants={itemVariants}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="text-center p-6 rounded-2xl backdrop-blur-sm"
                                style={{ 
                                    backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                                    border: `1px solid ${colors.borderColor}`
                                }}
                                whileHover={{ 
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                                    {stat.value}
                                </div>
                                <div className="text-sm" style={{ color: colors.textSecondary }}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Mission Section */}
            <motion.section 
                className="py-20 px-4 sm:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="grid lg:grid-cols-2 gap-12 items-center"
                        variants={itemVariants}
                    >
                        <div>
                            <motion.h2 
                                className="text-3xl md:text-4xl font-bold mb-6"
                                style={{ color: colors.textPrimary }}
                            >
                                Our Mission
                            </motion.h2>
                            <motion.p 
                                className="text-lg leading-relaxed mb-6"
                                style={{ color: colors.textSecondary }}
                            >
                                To democratize AI technology and make advanced machine learning capabilities accessible to organizations of all sizes. We believe that every company should have the power to leverage AI to solve their most complex challenges.
                            </motion.p>
                            <motion.p 
                                className="text-lg leading-relaxed"
                                style={{ color: colors.textSecondary }}
                            >
                                Through our comprehensive platform, we provide cutting-edge tools for examination management, people analytics, and intelligent automation that drive real business value.
                            </motion.p>
                        </div>
                        <motion.div 
                            className="relative"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div 
                                className="w-full h-80 rounded-3xl"
                                style={{ 
                                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}20)`,
                                    border: `2px solid ${colors.borderColor}`
                                }}
                            >
                                <div className="flex items-center justify-center h-full">
                                    <BuildingOffice2Icon className="w-32 h-32" style={{ color: colors.primary }} />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Values Section */}
            <motion.section 
                className="py-20 px-4 sm:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        className="text-center mb-16"
                        variants={itemVariants}
                    >
                        <motion.h2 
                            className="text-3xl md:text-4xl font-bold mb-6"
                            style={{ color: colors.textPrimary }}
                        >
                            Our Values
                        </motion.h2>
                        <motion.p 
                            className="text-xl max-w-2xl mx-auto"
                            style={{ color: colors.textSecondary }}
                        >
                            The principles that guide everything we do
                        </motion.p>
                    </motion.div>

                    <motion.div 
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={itemVariants}
                    >
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
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
                                    <value.icon className="w-8 h-8" style={{ color: colors.primary }} />
                                </motion.div>
                                <motion.h3 
                                    className="text-xl font-semibold mb-3"
                                    style={{ color: colors.textPrimary }}
                                >
                                    {value.title}
                                </motion.h3>
                                <motion.p 
                                    className="text-sm leading-relaxed"
                                    style={{ color: colors.textSecondary }}
                                >
                                    {value.description}
                                </motion.p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section 
                className="py-20 px-4 sm:px-6 lg:px-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div 
                        className="p-12 rounded-3xl"
                        style={{ 
                            background: `linear-gradient(135deg, ${colors.primary}10, ${colors.accent}10)`,
                            border: `2px solid ${colors.borderColor}`
                        }}
                        variants={itemVariants}
                    >
                        <motion.h2 
                            className="text-3xl md:text-4xl font-bold mb-6"
                            style={{ color: colors.textPrimary }}
                        >
                            Join Us in Shaping the Future
                        </motion.h2>
                        <motion.p 
                            className="text-xl mb-8"
                            style={{ color: colors.textSecondary }}
                        >
                            Ready to transform your organization with the power of AI?
                        </motion.p>
                        <motion.button
                            className="px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300"
                            style={{ backgroundColor: colors.primary }}
                            whileHover={{ 
                                scale: 1.05,
                                boxShadow: `0 10px 25px ${colors.primary}40`
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started Today
                        </motion.button>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default Company; 