import React from 'react';
import { DesignTokenRegistry } from '../types';
import { Palette, Type, Box, Database } from 'lucide-react';

interface DTRViewProps {
  dtr: DesignTokenRegistry | null;
  isCompact?: boolean;
}

export const DTRView: React.FC<DTRViewProps> = ({ dtr, isCompact }) => {
  if (!dtr) {
    return isCompact ? (
      <span className="text-[10px] text-gray-700 italic font-mono">system_idle : buffer_empty</span>
    ) : (
      <div className="p-12 border border-dashed border-nexus-border rounded-sm text-center bg-nexus-bg/30">
        <div className="tech-label opacity-40 mb-2">Awaiting Analysis</div>
        <p className="text-[10px] text-gray-700 italic">tokens_null : registry_empty</p>
      </div>
    );
  }

  const colors = dtr?.colors || {};
  const typography = dtr?.typography || { displayFont: 'Default', bodyFont: 'Default', monoFont: 'Default' };
  const geometry = dtr?.geometry || { borderRadius: '0px', spacingUnit: '0px', containerWidth: '1200px' };

  if (isCompact) {
    return (
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
          {Object.entries(colors).slice(0, 5).map(([key, value]) => (
            <div 
              key={key} 
              className="w-3 h-3 rounded-full border border-white/20 shadow-sm" 
              style={{ backgroundColor: (value as string) }}
              title={`${key}: ${value}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono whitespace-nowrap">
          <div className="flex gap-2">
            <span className="text-gray-600 uppercase">Font:</span>
            <span className="text-blue-400 font-bold">{typography.displayFont}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-600 uppercase">Rad:</span>
            <span className="text-emerald-400 font-bold">{geometry.borderRadius}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-600 uppercase">Audience:</span>
            <span className="text-purple-400 font-bold uppercase">{dtr.brandDna?.audience || 'N/A'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Registry Panel */}
      <div className="space-y-6">
        <div className="p-5 bg-nexus-bg border border-nexus-border/50 rounded-md shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Palette size={16} className="text-nexus-accent" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-nexus-accent">Color_DNA_Registry</h3>
            </div>
            <span className="text-[9px] font-mono opacity-30">HEX_SAMPLED : HEX_LOCKED</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2 p-2 bg-nexus-surface/10 rounded border border-white/5">
                <div 
                  className="w-full h-10 rounded shadow-inner border border-white/10" 
                  style={{ backgroundColor: (value as string) || 'transparent' }}
                />
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-500 uppercase truncate">{key.replace('color_', '')}</span>
                  <span className="text-[10px] font-mono text-nexus-accent">{String(value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-nexus-bg border border-nexus-border/50 rounded-md">
            <div className="flex items-center gap-2 mb-4">
              <Type size={16} className="text-blue-400" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Typography</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] text-gray-500 uppercase">Primary</span>
                <span className="text-[11px] text-white font-black">{typography?.displayFont}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] text-gray-500 uppercase">Accent</span>
                <span className="text-[11px] text-white font-mono">{typography?.monoFont}</span>
              </div>
            </div>
          </div>
          <div className="p-5 bg-nexus-bg border border-nexus-border/50 rounded-md">
            <div className="flex items-center gap-2 mb-4">
              <Box size={16} className="text-emerald-400" />
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Geometry</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] text-gray-500 uppercase">Corner_Rad</span>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">{geometry?.borderRadius}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] text-gray-500 uppercase">Stage_Width</span>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">{geometry?.containerWidth}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DNA Panel */}
      <div className="p-6 bg-nexus-bg border-l-2 border-nexus-accent rounded-r-md relative overflow-hidden bg-gradient-to-br from-nexus-bg to-nexus-accent/5">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] italic font-serif text-8xl pointer-events-none uppercase select-none">SYST</div>
        <div className="flex items-center gap-2 mb-8">
          <Database size={16} className="text-purple-500" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-nexus-accent">Cognitive_Signals</h3>
        </div>
        
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Market Alignment</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white uppercase tracking-tighter">{dtr?.brandDna?.audience || 'IDLE'}</span>
                {dtr?.brandDna?.audience && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Spectral Tone</span>
              <span className="text-xs text-blue-400 italic font-medium">{dtr?.brandDna?.voice || 'Default_Sync'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-2">
              Strategic Hooks_Analysis <div className="h-px flex-1 bg-white/5" />
            </span>
            <div className="flex flex-wrap gap-2">
              {dtr?.brandDna?.hooks?.map((hook, i) => (
                <span key={i} className="px-3 py-1.5 bg-nexus-accent/10 border border-nexus-accent/20 rounded-full text-[10px] text-nexus-accent font-bold tracking-tight">
                  {hook}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center justify-between text-[8px] font-mono text-gray-600">
              <span>SYNC_VERSION: ACE_3.1.2</span>
              <span>INTEGRITY: 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
