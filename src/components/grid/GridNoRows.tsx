import React from 'react';
import { motion } from 'framer-motion';

export const GridNoRows: React.FC = () => (
  <motion.div
    className="flex flex-col items-center justify-center h-full gap-3 text-[#9B9992]"
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="text-[40px] opacity-30 select-none">⊘</div>
    <div className="text-[13px] font-medium text-[#C4C2BB]">No students match current filters</div>
    <div className="text-[11px] text-[#D0CEC7]">Try adjusting your search or filter criteria</div>
  </motion.div>
);
