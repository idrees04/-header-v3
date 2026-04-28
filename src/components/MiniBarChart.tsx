import React from 'react';
import { motion } from 'framer-motion';

interface MiniBarChartProps {
  title:  string;
  data:   Record<string, number>;
  colors: string[];
  max?:   number;
}

export const MiniBarChart: React.FC<MiniBarChartProps> = React.memo(({ title, data, colors, max: maxProp }) => {
  const entries = Object.entries(data).sort(([,a],[,b]) => b - a).slice(0, 7);
  const max     = maxProp ?? Math.max(...entries.map(([,v]) => v), 1);

  return (
    <div className="flex flex-col gap-1.5 bg-white rounded-[6px] border border-[rgba(0,0,0,0.08)] px-3 py-2">
      <div className="text-[9px] font-bold uppercase tracking-[0.6px] text-[#9B9992]">{title}</div>
      <div className="flex flex-col gap-[3px]">
        {entries.map(([label, value], i) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-[78px] text-[9.5px] text-[#9B9992] text-right truncate shrink-0" title={label}>{label}</div>
            <div className="flex-1 h-[5px] rounded-full bg-[#F2F1EE] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: colors[i % colors.length] }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.round((value / max) * 100)}%` }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="w-4 text-[9.5px] text-[#C4C2BB] text-right font-mono shrink-0">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
});
MiniBarChart.displayName = 'MiniBarChart';
