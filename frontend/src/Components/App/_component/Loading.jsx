import { motion } from 'framer-motion';
export default function Loading(){
    return(
        <div className="flex items-center justify-center min-h-screen">
            <motion.img
                src="/images/logo.png"
                alt="Logo"
                className="w-24"
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    )
}