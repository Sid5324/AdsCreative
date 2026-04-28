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
      <header className="h-16 border-b border-nexus-border bg-nexus-bg/80 backdrop-blur-md sticky top-0 z-50 flex items-center px-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-nexus-accent flex items-center justify-center shadow-lg shadow-blue-500/10 rotate-45">
            <Zap size={20} className="text-white -rotate-45" />
          </div>
          <div className="flex flex-col ml-1">
            <h1 className="text-[16px] font-bold tracking-tight text-white uppercase leading-none italic">Nexus ACE</h1>
            <span className="text-[9px] text-nexus-accent font-mono uppercase tracking-[0.2em] mt-1.5 opacity-80">Orchestration Core 2.5</span>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded border border-nexus-border bg-nexus-surface/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="tech-label text-emerald-500">System Ready</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1700px] mx-auto w-full">
        {/* Left Column: Control Panel */}
        <div className="lg:col-span-4 space-y-8">
          <section className="glass-card rounded-sm p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 italic font-serif text-4xl pointer-events-none">ACE</div>
            
            <div className="flex items-center gap-3 mb-8 border-b border-nexus-border pb-4">
              <Sparkles size={14} className="text-nexus-accent" />
              <h2 className="tech-label">Configuration Node</h2>
            </div>

            <form onSubmit={handleProcess} className="space-y-8">
                <div className="space-y-6">
                <div className="space-y-3">
                  <label className="tech-label flex items-center gap-2">
                    <LayoutTemplate size={12} /> Target Architecture
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {templates.map(t => (
                      <button 
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`group cursor-pointer p-4 rounded-sm border text-left transition-all flex items-center justify-between ${
                          selectedTemplate === t.id 
                          ? 'border-nexus-accent bg-nexus-accent/5' 
                          : 'border-nexus-border bg-nexus-surface hover:border-gray-600'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className={`text-[13px] font-bold tracking-tight uppercase ${selectedTemplate === t.id ? 'text-nexus-accent' : 'text-gray-300'}`}>
                            {t.name}
                          </span>
                          <span className="text-[10px] text-gray-500 mt-0.5 font-mono">{t.description}</span>
                        </div>
                        {selectedTemplate === t.id && (
                          <div className="w-2 h-2 rounded-full bg-nexus-accent glow-blue" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="tech-label flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon size={12} /> Creative Source
                    </div>
                    {adFile && (
                      <button 
                        type="button" 
                        onClick={clearFile}
                        className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider"
                      >
                        <X size={10} /> Discard
                      </button>
                    )}
                  </label>
                    
                    {!adFile ? (
                      <div className="relative group">
                        <input 
                          type="url"
                          placeholder="INPUT_IMAGE_URL"
                          className="w-full bg-nexus-bg border border-nexus-border rounded-sm px-4 py-4 text-[13px] text-gray-200 focus:outline-none focus:border-nexus-accent transition-all placeholder:text-gray-800 font-mono pr-12"
                          value={adUrl}
                          onChange={(e) => {
                            setAdUrl(e.target.value);
                            setAdFile(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute right-3 top-3 p-2 rounded-sm border border-nexus-border text-gray-500 hover:text-white hover:border-nexus-accent transition-all bg-nexus-surface/50"
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
                      <div className="relative rounded-sm overflow-hidden border border-nexus-border bg-nexus-bg p-2 transition-all hover:border-nexus-accent/50">
                        {adPreview && (
                          <img 
                            src={adPreview} 
                            alt="Upload preview" 
                            className="w-full h-40 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700" 
                          />
                        )}
                        <div className="absolute top-4 left-4">
                          <div className="px-2 py-1 rounded-sm bg-nexus-accent/90 text-white text-[9px] font-mono uppercase tracking-[0.2em] shadow-2xl backdrop-blur-sm">
                            Cache_Active
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                <div className="space-y-3">
                  <label className="tech-label flex items-center gap-2">
                    <LinkIcon size={12} /> Brand Identity
                  </label>
                  <input 
                    type="url"
                    required
                    placeholder="INPUT_BRAND_DOMAIN"
                    className="w-full bg-nexus-bg border border-nexus-border rounded-sm px-4 py-4 text-[13px] text-gray-200 focus:outline-none focus:border-nexus-accent transition-all placeholder:text-gray-800 font-mono"
                    value={brandUrl}
                    onChange={(e) => setBrandUrl(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className={`w-full py-5 rounded-sm font-mono uppercase tracking-[0.2em] text-[11px] font-bold flex items-center justify-center gap-4 transition-all shadow-xl active:scale-[0.98] ${
                  isProcessing 
                    ? 'bg-nexus-surface text-gray-600 border border-nexus-border cursor-wait' 
                    : 'bg-white text-nexus-bg hover:bg-nexus-accent hover:text-white border border-white hover:border-nexus-accent'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Orchestrating...
                  </>
                ) : (
                  <>
                    Initialize Nexus
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-nexus-border pb-2 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${result ? 'bg-emerald-500' : 'bg-nexus-accent'} animate-pulse`} />
                <span className="tech-label">Terminal Trace</span>
              </div>
              {result && (
                <span className="text-[9px] font-mono text-emerald-500 tracking-wider">SYNC_READY</span>
              )}
            </div>
            <TraceTerminal logs={result?.logs || []} />
          </section>
        </div>

        {/* Right Column: Analysis & Production */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/5 border border-red-500/20 p-6 rounded-sm flex items-start gap-4 text-red-500"
              >
                <ShieldAlert size={20} className="mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="tech-label text-red-500">Critical Error</span>
                  <p className="text-[13px] font-mono leading-relaxed">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <section className="glass-card rounded-sm flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-nexus-border bg-nexus-surface/30">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-nexus-accent shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <h2 className="tech-label text-white">Production Engine Output</h2>
                </div>
                {result && (
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                    <span className="opacity-30">|</span>
                    <span className="uppercase tracking-widest">Spectral_Drift:</span>
                    <span className="text-nexus-accent">{(Math.random() * 0.15).toFixed(3)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col p-8 overflow-y-auto custom-scrollbar">
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="tech-label italic">Design Token Registry</h3>
                  <div className="h-px bg-nexus-border flex-1 mx-6" />
                </div>
                <DTRView dtr={result?.dtr || null} />
              </div>

              <div className="flex-1 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="tech-label italic">V2 Spatial Renderer</h3>
                  <div className="h-px bg-nexus-border flex-1 mx-6" />
                </div>
                <div className="flex-1 rounded-sm border border-nexus-border overflow-hidden bg-nexus-bg">
                  <PreviewPane code={result?.code || null} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="h-12 border-t border-nexus-border bg-nexus-bg/50 backdrop-blur-sm flex items-center px-8 justify-between">
        <div className="flex items-center gap-8">
          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em]">© NEXUS CORE V2.5</span>
          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em] font-bold">MODE: PRODUCTION_STABLE</span>
        </div>
        <div className="hidden sm:flex items-center gap-8 italic">
           <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.2em] font-bold">Node: ASIA_PACIFIC_RUN</span>
           <div className="flex items-center gap-1.5">
             <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.2em]">Up-time: 99.98%</span>
           </div>
        </div>
      </footer>

    </div>
  );
}

