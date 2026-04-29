import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Key, Layout, Play, CheckCircle } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-nexus-bg/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl bg-nexus-surface border border-nexus-border rounded-lg shadow-2xl overflow-hidden relative"
          >
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-start text-white">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-nexus-accent" size={20} />
                    <span className="tech-label tracking-widest text-nexus-accent">Intelligence Briefing</span>
                  </div>
                  <h2 className="text-3xl font-black italic leading-none">ACE V3 SPATIAL</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6 text-white font-black">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Key size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1 uppercase tracking-wide">1. Configuration</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-medium font-sans">
                        Input your <span className="text-nexus-accent font-bold">Gemini API Key</span> via the [ SETTINGS ] menu. This powers the brand intelligence engine.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                      <Layout size={18} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1 uppercase tracking-wide">2. Template Selection</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-medium font-sans">
                        Select an architecture. <span className="">"ACE_V3_Immersive"</span> is optimized for high-conversion B2B/B2C SaaS products.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Play size={18} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1 uppercase tracking-wide">3. Brand Sync</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-medium font-sans">
                        Provide a URL and an image. ACE will deconstruct the <span className="text-emerald-400 italic">Visual DNA</span> and project it into the spatial renderer.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-nexus-surface/50 border border-nexus-border rounded-lg p-6 flex flex-col justify-center">
                  <h3 className="tech-label text-[10px] text-nexus-accent mb-4">Core_Logic_Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <CheckCircle size={12} className="text-emerald-500" />
                      <span className="text-gray-400 italic">V3.1 Spatial Reach Active</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <CheckCircle size={12} className="text-emerald-500" />
                      <span className="text-gray-400 italic">Tone Calibration Engaged</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <CheckCircle size={12} className="text-emerald-500" />
                      <span className="text-gray-400 italic">Cross-Brand Asset Registry</span>
                    </div>
                  </div>
                  <div className="mt-8">
                     <button 
                      onClick={onClose}
                      className="w-full nexus-button py-4 rounded-sm"
                    >
                      Acknowledge & Sync
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-nexus-accent/5 border-t border-nexus-border px-8 py-3 flex justify-between items-center text-[9px] font-mono text-gray-600">
               <span>SYSTEM_VERSION: 3.1.2_BETA</span>
               <span className="animate-pulse">AWAITING_COMMAND...</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
