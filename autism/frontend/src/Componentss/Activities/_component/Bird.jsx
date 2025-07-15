import { motion } from "framer-motion";
import { BIRD_X } from "../../../config/activityConstants";

export default function Bird({ position }) {
    return (
        <motion.div
            className="absolute w-[40px] h-[40px] bg-yellow-400 rounded-full shadow-lg"
            animate={{ top: position, left: `${BIRD_X}px` }}
            transition={{ duration: 0.15, ease: "easeOut" }}
        />
    );
}