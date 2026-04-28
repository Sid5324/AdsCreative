import React from 'react';
import { DesignTokenRegistry } from '../types';
import { Palette, Type, Box } from 'lucide-react';

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

  const colors = dtr.colors || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Colors */}
      <div className="p-6 bg-nexus-surface/50 border border-nexus-border rounded-sm">
        <div className="flex items-center gap-3 mb-6">
          <Palette size={14} className="text-nexus-accent" />
          <h3 className="tech-label italic">Chromesthesia Registry</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between group">
              <span className="text-[11px] font-mono text-gray-500 uppercase tracking-tighter group-hover:text-gray-400 transition-colors">{key}</span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-gray-300 opacity-60 group-hover:opacity-100 transition-opacity">{value}</span>
                <div 
                  className="w-5 h-5 rounded-sm border border-white/5 shadow-inner" 
                  style={{ backgroundColor: value as string }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography & Geometry */}
      <div className="space-y-4">
        <div className="p-4 bg-[#1a1d23] border border-[#2d3139] rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Type size={16} className="text-blue-400" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">Typography_Stack</h3>
          </div>
          <div className="space-y-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-600 uppercase font-bold mb-1">Display</span>
              <span className="text-sm text-gray-200">{dtr.typography.displayFont}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-600 uppercase font-bold mb-1">Body</span>
              <span className="text-sm text-gray-200">{dtr.typography.bodyFont}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#1a1d23] border border-[#2d3139] rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Box size={16} className="text-emerald-400" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">Geometry_Tokens</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-gray-600 uppercase font-bold block mb-1">Radius</span>
              <span className="text-xs text-gray-200 font-mono">{dtr.geometry.borderRadius}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-600 uppercase font-bold block mb-1">Spacing</span>
              <span className="text-xs text-gray-200 font-mono">{dtr.geometry.spacingUnit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
