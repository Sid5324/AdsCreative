import React from 'react';
import { DesignTokenRegistry } from '../types';
import { Palette, Type, Box } from 'lucide-react';

interface DTRViewProps {
  dtr: DesignTokenRegistry | null;
}

export const DTRView: React.FC<DTRViewProps> = ({ dtr }) => {
  if (!dtr) {
    return (
      <div className="p-8 border border-dashed border-gray-700 rounded-lg text-center text-gray-500 italic">
        Design tokens will appear here after analysis.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Colors */}
      <div className="p-4 bg-[#1a1d23] border border-[#2d3139] rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} className="text-pink-400" />
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">Palette_Registry</h3>
        </div>
        <div className="space-y-3">
          {Object.entries(dtr.colors).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-gray-500 uppercase">{key}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-300">{value}</span>
                <div 
                  className="w-4 h-4 rounded-sm border border-white/10" 
                  style={{ backgroundColor: value }}
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
