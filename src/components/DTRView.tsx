import React from 'react';
import { DesignTokenRegistry } from '../types';
import { Palette, Type, Box, Database } from 'lucide-react';

interface DTRViewProps {
  dtr: DesignTokenRegistry | null;
}

export const DTRView: React.FC<DTRViewProps> = ({ dtr }) => {
  if (!dtr) {
    return (
      <div className="p-12 border border-dashed border-nexus-border rounded-sm text-center bg-nexus-bg/30">
        <div className="tech-label opacity-40 mb-2">Awaiting Analysis</div>
        <p className="text-[10px] text-gray-700 italic">tokens_null : registry_empty</p>
      </div>
    );
  }

  const colors = dtr?.colors || {};
  const typography = dtr?.typography || { displayFont: 'Default', bodyFont: 'Default', monoFont: 'Default' };
  const geometry = dtr?.geometry || { borderRadius: '0px', spacingUnit: '0px', containerWidth: '1200px' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 p-4 sm:p-0">
      {/* Visual Identity Column */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-8">
        <div className="p-4 sm:p-8 bg-nexus-surface/5 border border-nexus-border rounded-sm">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 bg-nexus-accent/10 rounded-sm">
                <Palette size={18} className="text-nexus-accent sm:hidden" />
                <Palette size={20} className="text-nexus-accent hidden sm:block" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-white">Chromatics Registry</h3>
                <p className="text-[9px] sm:text-[10px] text-gray-500 font-mono mt-1">NODE_COLOR_DNA // HEX_VERIFIED</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-black/20 rounded border border-white/5 group hover:border-nexus-accent/30 transition-all">
                <div 
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-sm shadow-inner border border-white/10 shrink-0" 
                  style={{ backgroundColor: (value as string) || 'transparent' }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5 sm:mb-1">
                    {key.replace('color_', '').replace('_', ' ')}
                  </span>
                  <span className="text-xs sm:text-sm font-mono text-nexus-accent font-bold select-all truncate">{String(value).toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          <div className="p-4 sm:p-8 bg-nexus-surface/5 border border-nexus-border rounded-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <Type size={20} className="text-blue-400" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">Typography</h3>
            </div>
            <div className="space-y-4 sm:space-y-6 flex-1">
              <div className="flex flex-col gap-1.5 sm:gap-2 border-l-2 border-blue-400 pl-4 sm:pl-5">
                <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-black tracking-widest">Primary Display</span>
                <span className="text-sm sm:text-base text-white font-black tracking-tight leading-tight">{typography?.displayFont?.split(',')[0]}</span>
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2 border-l-2 border-white/10 pl-4 sm:pl-5">
                <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-black tracking-widest">System Mono</span>
                <span className="text-[11px] sm:text-xs font-mono text-gray-400 block truncate">{typography?.monoFont}</span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-8 bg-nexus-surface/5 border border-nexus-border rounded-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <Box size={20} className="text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">Geometry</h3>
            </div>
            <div className="space-y-4 sm:space-y-6 flex-1">
              <div className="flex justify-between items-center border-b border-white/5 pb-3 sm:pb-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-black tracking-widest">Corner Radius</span>
                  <span className="text-sm sm:text-base text-white font-mono font-black">{geometry?.borderRadius}</span>
                </div>
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-emerald-400/40 bg-emerald-400/5 shadow-[0_0_15px_rgba(52,211,153,0.1)]" 
                  style={{ borderRadius: geometry?.borderRadius }} 
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-black tracking-widest">Stage Width</span>
                  <span className="text-sm sm:text-base text-white font-mono font-black">{geometry?.containerWidth || 'AUTO'}</span>
                </div>
                <span className="tech-label text-[8px] sm:text-[10px] opacity-30">PX_GRID</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand DNA Column */}
      <div className="h-full">
        <div className="h-full p-6 sm:p-10 bg-nexus-accent/5 border border-nexus-accent/20 rounded-sm relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] italic font-serif text-8xl sm:text-9xl pointer-events-none uppercase select-none">DNA</div>
          
          <div className="flex items-center gap-4 mb-8 sm:mb-12">
            <Database size={20} className="text-nexus-accent sm:hidden" />
            <Database size={24} className="text-nexus-accent hidden sm:block" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-nexus-accent">Market DNA</h3>
          </div>
          
          <div className="flex-1 space-y-8 sm:space-y-12">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase font-black tracking-widest">Target Audience</span>
                <span className="text-[8px] sm:text-[9px] font-mono text-nexus-accent">V3_ANALYSIS</span>
              </div>
              <div className="p-4 sm:p-6 bg-nexus-accent border border-nexus-accent/20 rounded-sm shadow-xl shadow-nexus-accent/30">
                <span className="text-sm sm:text-base font-black text-white uppercase tracking-tight leading-tight sm:leading-normal block">
                  {dtr?.brandDna?.audience || 'CALIBRATING...'}
                </span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase font-black tracking-widest block">Brand Semantic Tone</span>
              <p className="text-sm sm:text-base text-gray-300 italic font-medium leading-relaxed border-l-2 sm:border-l-4 border-nexus-accent/40 pl-4 sm:pl-6">
                "{dtr?.brandDna?.voice || 'Neural engine is identifying patterns...'}"
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase font-black tracking-widest block">Structural Hooks</span>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {dtr?.brandDna?.hooks?.map((hook, i) => (
                  <div key={i} className="px-3 sm:px-4 py-2 sm:py-3 bg-black/40 border border-white/5 rounded-sm flex items-center gap-2 sm:gap-3 hover:border-nexus-accent/40 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-nexus-accent shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                    <span className="text-[9px] sm:text-[10px] text-gray-200 font-black uppercase tracking-widest truncate">{hook}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-white/10">
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono">
              <span className="text-gray-700 tracking-tighter">CORE: ACE_3.8.2</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-nexus-accent animate-pulse" />
                <span className="text-nexus-accent font-black">STREAM_ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
