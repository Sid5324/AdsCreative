import React from 'react';
import { Terminal as TerminalIcon, ShieldCheck, Activity, Cpu } from 'lucide-react';
import { AgentLog } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TraceTerminalProps {
  logs: AgentLog[];
}

export const TraceTerminal: React.FC<TraceTerminalProps> = ({ logs }) => {
  return (
    <div className="bg-[#0f1115] border border-[#2d3139] rounded-lg overflow-hidden flex flex-col h-[400px] shadow-2xl">
      <div className="bg-[#1a1d23] px-4 py-2 flex items-center justify-between border-bottom border-[#2d3139]">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-emerald-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">System Log Trace</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed">
        <AnimatePresence>
          {logs.length === 0 ? (
            <div className="text-gray-600 italic">Awaiting orchestration initialization...</div>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-3 last:mb-0"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {log.agentName === 'AdAnalyzer' && <Activity size={14} className="text-blue-400" />}
                    {log.agentName === 'DTR_Extractor' && <Cpu size={14} className="text-purple-400" />}
                    {log.agentName === 'QA_Validator' && <ShieldCheck size={14} className="text-emerald-400" />}
                    {log.agentName !== 'AdAnalyzer' && log.agentName !== 'DTR_Extractor' && log.agentName !== 'QA_Validator' && (
                      <div className="w-3.5 h-3.5 rounded-full bg-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-gray-300 font-bold">[{log.agentName}]</span>
                      <span className="text-gray-500 text-[11px] uppercase tracking-tighter">{log.agentRole}</span>
                      <span className="text-gray-600 text-[10px] ml-auto">{log.timestamp}</span>
                    </div>
                    <p className="text-gray-400 whitespace-pre-wrap">{log.message}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
