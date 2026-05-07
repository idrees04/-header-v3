import React from 'react';
import { motion } from 'framer-motion';

export const GridNoRows: React.FC = () => (
  <motion.div
    className="flex flex-col items-center justify-center h-full gap-3 text-black"
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
  >
    <div className="text-[40px] opacity-30 select-none">⊘</div>
    <div className="text-[13px] font-medium text-black">No students match current filters</div>
    <div className="text-[11px] text-black">Try adjusting your search or filter criteria</div>
  </motion.div>
);
