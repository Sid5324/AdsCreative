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

  if (!code) {
    return (
      <div className="flex-1 flex items-center justify-center border border-dashed border-gray-700 rounded-lg min-h-[500px] bg-[#0c0e12]">
        <div className="text-center space-y-4">
          <Layout size={48} className="text-gray-700 mx-auto" />
          <p className="text-gray-500 font-mono text-sm max-w-[280px]">
            Ready for V2_Renderer output. Input Ad Creative and Brand Target to begin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col border border-[#2d3139] rounded-lg overflow-hidden bg-[#0c0e12] min-h-[600px] shadow-2xl">
      <div className="bg-[#1a1d23] px-4 py-2 flex items-center justify-between border-b border-[#2d3139]">
        <div className="flex gap-4">
          <button 
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest transition-colors ${viewMode === 'preview' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Monitor size={14} /> Preview
          </button>
          <button 
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest transition-colors ${viewMode === 'code' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <CodeIcon size={14} /> Source
          </button>
        </div>

        <div className="flex bg-[#0f1115] rounded p-1">
          {viewMode === 'preview' && (
            <>
              <button 
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded transition-all ${device === 'desktop' ? 'bg-[#2d3139] text-white' : 'text-gray-600 hover:text-gray-400'}`}
                title="Desktop View"
              >
                <Monitor size={14} />
              </button>
              <button 
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded transition-all ${device === 'mobile' ? 'bg-[#2d3139] text-white' : 'text-gray-600 hover:text-gray-400'}`}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
              <div className="w-px h-6 bg-gray-800 mx-1"></div>
            </>
          )}
          <button 
            onClick={handleDownload}
            className="p-1.5 rounded transition-all text-gray-600 hover:text-gray-400 hover:bg-[#2d3139]"
            title="Download HTML"
          >
            <Download size={14} />
          </button>
          <button 
            onClick={handleOpenFullscreen}
            className="p-1.5 rounded transition-all text-gray-600 hover:text-gray-400 hover:bg-[#2d3139]"
            title="View Fullscreen in New Tab"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-white">
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
          <div className="bg-[#0f1115] h-full p-6 overflow-auto custom-scrollbar">
            <pre className="text-gray-300 font-mono text-[13px] leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
