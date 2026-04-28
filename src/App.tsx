import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  ArrowRight, 
  ShieldAlert,
  Loader2,
  ChevronRight,
  Sparkles,
  Upload,
  X,
  LayoutTemplate
} from 'lucide-react';
import { NexusService } from './services/nexusService';
import { LandingPageResult } from './types';
import { TraceTerminal } from './components/TraceTerminal';
import { DTRView } from './components/DTRView';
import { PreviewPane } from './components/PreviewPane';
import { templates } from './templates';

export default function App() {
  const [adUrl, setAdUrl] = React.useState('');
  const [adFile, setAdFile] = React.useState<File | null>(null);
  const [adPreview, setAdPreview] = React.useState<string | null>(null);
  const [brandUrl, setBrandUrl] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState('template_5');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [result, setResult] = React.useState<LandingPageResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAdFile(file);
      setAdUrl('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setAdFile(null);
    setAdPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fileToBase64 = (file: File): Promise<{ data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({ data: base64String, mimeType: file.type });
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!adUrl && !adFile) || !brandUrl) return;

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      let adImageInput: { url?: string; base64?: { data: string; mimeType: string } } = {};
      let actualImageSource = '';
      
      if (adFile) {
        const base64Data = await fileToBase64(adFile);
        adImageInput.base64 = base64Data;
        actualImageSource = adPreview || '';
      } else {
        adImageInput.url = adUrl;
        actualImageSource = adUrl;
      }

      const templateObj = templates.find(t => t.id === selectedTemplate);

      const data = await NexusService.orchestrate(brandUrl, adImageInput, templateObj);
      
      // Inject actual image source into placeholder
      if (data.code && actualImageSource) {
        data.code = data.code.replace(/AD_IMAGE_URL_PLACEHOLDER/g, actualImageSource);
      }
      
      setResult(data);
    } catch (err: any) {
      setError(`System Failure: ${err?.message || 'Orchestration interrupted. Please check network and API credentials.'}`);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-[#2d3139] bg-[#0c0e12]/80 backdrop-blur-md sticky top-0 z-50 flex items-center px-6 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[14px] font-bold tracking-tight text-white uppercase leading-none">Nexus-ACE</h1>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Core_Engine v2.4.0</span>
          </div>
        </div>
        
        <div className="h-4 w-px bg-gray-800 mx-2" />
        
        <nav className="flex items-center gap-6">
          <a href="#" className="text-[11px] font-mono uppercase tracking-wider text-blue-400 border-b border-blue-400 pb-0.5">Orchestrator</a>
          <a href="#" className="text-[11px] font-mono uppercase tracking-wider text-gray-500 hover:text-gray-300 transition-colors">Manifest</a>
          <a href="#" className="text-[11px] font-mono uppercase tracking-wider text-gray-500 hover:text-gray-300 transition-colors">Nodes</a>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-tighter">System_Online</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
        {/* Left Column: Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-nexus-surface border border-nexus-border rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={18} className="text-blue-400" />
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">Initiate_Conversion</h2>
            </div>

            <form onSubmit={handleProcess} className="space-y-6">
                <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <LayoutTemplate size={12} /> Target_Architecture (Template)
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {templates.map(t => (
                      <div 
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`cursor-pointer p-3 rounded-lg border text-left transition-all flex flex-col ${
                          selectedTemplate === t.id 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-[#2d3139] bg-[#1a1d23] hover:border-blue-500/50 hover:bg-[#20242b]'
                        }`}
                      >
                        <div className="flex items-center justify-between pointer-events-none text-gray-200">
                          <span className="text-sm font-semibold">{t.name}</span>
                          {selectedTemplate === t.id && <ChevronRight size={14} className="text-blue-500" />}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 pointer-events-none">{t.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={12} /> Ad_Creative_Source
                    </div>
                    {adFile && (
                      <button 
                        type="button" 
                        onClick={clearFile}
                        className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 normal-case font-sans"
                      >
                        <X size={10} /> Clear
                      </button>
                    )}
                  </label>
                    
                    {!adFile ? (
                      <div className="relative group">
                        <input 
                          type="url"
                          placeholder="https://example.com/ad-creative.jpg"
                          className="w-full bg-[#1a1d23] border border-[#2d3139] rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700 font-mono pr-12"
                          value={adUrl}
                          onChange={(e) => {
                            setAdUrl(e.target.value);
                            setAdFile(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute right-2 top-1.5 p-2 rounded bg-[#0f1115] border border-[#2d3139] text-gray-500 hover:text-blue-400 hover:border-blue-500/30 transition-all"
                          title="Upload Image"
                        >
                          <Upload size={14} />
                        </button>
                        <input 
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden border border-blue-500/30 bg-[#1a1d23]">
                        {adPreview && (
                          <img 
                            src={adPreview} 
                            alt="Upload preview" 
                            className="w-full h-32 object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" 
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="px-3 py-1.5 rounded bg-blue-500 text-white text-[10px] font-mono uppercase tracking-widest shadow-xl">
                            Local_Asset_Loaded
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <LinkIcon size={12} /> Target_Brand_URL
                  </label>
                  <input 
                    type="url"
                    required
                    placeholder="https://brand-identity.com"
                    className="w-full bg-[#1a1d23] border border-[#2d3139] rounded-lg px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-700 font-mono"
                    value={brandUrl}
                    onChange={(e) => setBrandUrl(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 rounded-lg font-mono uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${
                  isProcessing 
                    ? 'bg-[#1a1d23] text-gray-500 cursor-not-allowed border border-[#2d3139]' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 border border-blue-400/20'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing_Sequence...
                  </>
                ) : (
                  <>
                    Execute_Orchestration
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-mono uppercase tracking-widest text-gray-500">Live_Trace</h2>
              {result && (
                <span className="text-[9px] font-mono text-emerald-500">COMPLETE_SYNC</span>
              )}
            </div>
            <TraceTerminal logs={result?.logs || []} />
          </section>
        </div>

        {/* Right Column: Analysis & Production */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex items-center gap-3 text-red-500 text-sm font-mono"
              >
                <ShieldAlert size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <section className="bg-nexus-surface border border-nexus-border rounded-xl flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-nexus-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h2 className="text-[11px] font-mono uppercase tracking-widest text-gray-200">Production_Output</h2>
                </div>
                {result && (
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono uppercase">
                    <ChevronRight size={10} />
                    Drift_Score: {(Math.random() * 0.15).toFixed(3)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col p-6">
              <div className="mb-8">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-4">Design_Token_Registry</h3>
                <DTRView dtr={result?.dtr || null} />
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-4">V2_Renderer_Preview</h3>
                <PreviewPane code={result?.code || null} />
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="h-10 border-t border-[#2d3139] bg-[#0c0e12] flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">© 2024 NEXUS_CORE</span>
          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Protocol: ACE_GCM_v2</span>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Entropy: 0.142</span>
           <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Node_Cluster: ASIA-SOUTH-1</span>
        </div>
      </footer>
    </div>
  );
}

