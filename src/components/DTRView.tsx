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

  const colors = dtr?.colors || {};
  const typography = dtr?.typography || { displayFont: 'Default', bodyFont: 'Default', monoFont: 'Default' };
  const geometry = dtr?.geometry || { borderRadius: '0px', spacingUnit: '0px', containerWidth: '1200px' };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Colors */}
      <div className="p-6 bg-gray-900/40 border border-white/5 rounded-lg">
        <div className="flex items-center gap-3 mb-6">
          <Palette size={14} className="text-blue-500" />
          <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-400">Color_Registry</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between group">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-600 uppercase font-bold tracking-wider mb-0.5">{key.replace('_', ' ')}</span>
                <span className="text-[10px] font-mono text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity">{String(value)}</span>
              </div>
              <div 
                className="w-6 h-6 rounded border border-white/10 shadow-inner shrink-0" 
                style={{ backgroundColor: (value as string) || 'transparent' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Typography & Geometry */}
      <div className="space-y-4">
        <div className="p-4 bg-gray-900/40 border border-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Type size={16} className="text-blue-400" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500">Typography_Stack</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-600 uppercase font-bold mb-1">Display</span>
              <span className="text-sm text-gray-200 font-medium truncate">{typography?.displayFont || 'Default'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-600 uppercase font-bold mb-1">Body</span>
              <span className="text-sm text-gray-200 font-medium truncate">{typography?.bodyFont || 'Default'}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-900/40 border border-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Box size={16} className="text-emerald-400" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500">Geometry_Tokens</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-gray-600 uppercase font-bold block mb-1">Radius</span>
              <span className="text-xs text-gray-200 font-mono">{geometry?.borderRadius || '0px'}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-600 uppercase font-bold block mb-1">Spacing</span>
              <span className="text-xs text-gray-200 font-mono">{geometry?.spacingUnit || '0px'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
