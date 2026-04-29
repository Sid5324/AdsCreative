import React from 'react';
import { Layout, Code as CodeIcon, Monitor, Smartphone, ExternalLink, Download, Maximize2 } from 'lucide-react';

interface PreviewPaneProps {
  code: string | null;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ code }) => {
  const [viewMode, setViewMode] = React.useState<'preview' | 'code'>('preview');
  const [device, setDevice] = React.useState<'desktop' | 'mobile'>('desktop');

  const handleDownload = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'landing-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenFullscreen = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  if (!code) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-nexus-surface">
      {/* Renderer Context Bar */}
      <div className="bg-nexus-surface px-4 py-2 flex items-center justify-between border-b border-nexus-border shrink-0">
        <div className="flex gap-4">
          <button 
            onClick={() => setViewMode('preview')}
            className={`text-[9px] font-black uppercase tracking-tighter transition-all ${viewMode === 'preview' ? 'text-nexus-accent' : 'text-gray-500 hover:text-gray-400'}`}
          >
            [ OUTPUT_RENDER ]
          </button>
          <button 
            onClick={() => setViewMode('code')}
            className={`text-[9px] font-black uppercase tracking-tighter transition-all ${viewMode === 'code' ? 'text-nexus-accent' : 'text-gray-500 hover:text-gray-400'}`}
          >
            [ SRC_BLOB ]
          </button>
        </div>

        <div className="flex items-center gap-4">
          {viewMode === 'preview' && (
            <div className="flex gap-2">
              <button 
                onClick={() => setDevice('desktop')}
                className={`p-1 transition-all ${device === 'desktop' ? 'text-nexus-accent' : 'text-gray-500'}`}
              >
                <Monitor size={12} />
              </button>
              <button 
                onClick={() => setDevice('mobile')}
                className={`p-1 transition-all ${device === 'mobile' ? 'text-nexus-accent' : 'text-gray-500'}`}
              >
                <Smartphone size={12} />
              </button>
            </div>
          )}
          <div className="h-3 w-px bg-nexus-border mx-1" />
          <button 
            onClick={handleDownload}
            className="text-gray-500 hover:text-nexus-accent transition-colors"
          >
            <Download size={12} />
          </button>
          <button 
            onClick={handleOpenFullscreen}
            className="text-gray-500 hover:text-nexus-accent transition-colors"
          >
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'preview' ? (
          <div className={`mx-auto h-full transition-all duration-300 ${device === 'mobile' ? 'max-w-[375px] border-x border-gray-200' : 'w-full'}`}>
            <iframe 
              srcDoc={code}
              title="Landing Page Preview"
              className="w-full h-full border-none"
              sandbox="allow-scripts"
            />
          </div>
        ) : (
          <div className="bg-[#050505] h-full p-6 overflow-auto custom-scrollbar">
            <pre className="text-nexus-accent/80 font-mono text-[11px] leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
