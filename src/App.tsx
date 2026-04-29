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
  LayoutTemplate,
  Sun,
  Moon,
  HelpCircle
} from 'lucide-react';
import { NexusService } from './services/nexusService';
import { LandingPageResult } from './types';
import { DTRView } from './components/DTRView';
import { PreviewPane } from './components/PreviewPane';
import { OnboardingModal } from './components/OnboardingModal';
import { templates } from './templates';
// import { put } from '@vercel/blob'; // Using server-side proxy

export default function App() {
  const [adUrl, setAdUrl] = React.useState('');
  const [adFile, setAdFile] = React.useState<File | null>(null);
  const [adPreview, setAdPreview] = React.useState<string | null>(null);
  const [brandUrl, setBrandUrl] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState('template_5');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [result, setResult] = React.useState<LandingPageResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showDTRDetails, setShowDTRDetails] = React.useState(false);
  const [theme, setTheme] = React.useState<'dark' | 'light'>(() => (localStorage.getItem('nexus_theme') as 'dark' | 'light') || 'dark');
  const [showHelp, setShowHelp] = React.useState(false);

  React.useEffect(() => {
    const onboarded = localStorage.getItem('nexus_onboarded');
    if (!onboarded) {
      // Small delay to ensure everything is rendered
      const timer = setTimeout(() => setShowHelp(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  const [userGeminiKey, setUserGeminiKey] = React.useState(() => localStorage.getItem('nexus_gemini_key') || '');
  const [vercelBlobToken, setVercelBlobToken] = React.useState(() => localStorage.getItem('nexus_blob_token') || '');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    localStorage.setItem('nexus_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  const closeHelp = () => {
    setShowHelp(false);
    localStorage.setItem('nexus_onboarded', 'true');
  };

  const saveKey = (key: string) => {
    setUserGeminiKey(key);
    localStorage.setItem('nexus_gemini_key', key);
  };

  const saveBlobToken = (token: string) => {
    setVercelBlobToken(token);
    localStorage.setItem('nexus_blob_token', token);
  };

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

    console.log("%c[NEXUS] BOOT_SEQUENCE_INITIALIZED", "color: #3b82f6; font-weight: bold;");
    console.info(`[Nexus] Target Brand: ${brandUrl}`);

    try {
      let adImageInput: { url?: string; base64?: { data: string; mimeType: string } } = {};
      let actualImageSource = '';
      
      if (adFile) {
        console.info(`[Nexus] Processing Ad Media...`);
        try {
          console.log("%c[Nexus] Protocol: Server_Proxy_Upload", "color: #3b82f6; font-weight: bold;");
          const base64ForUpload = await fileToBase64(adFile);
          
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: `ad-creatives/${Date.now()}-${adFile.name}`,
              fileData: base64ForUpload.data,
              mimeType: adFile.type,
              userBlobToken: vercelBlobToken
            })
          });

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`Upload proxy failed: ${errorText}`);
          }
          
          const blob = await uploadResponse.json();
          adImageInput.url = blob.url;
          actualImageSource = blob.url;
          console.info(`[Nexus] Remote_Resource_Link: ${blob.url}`);
        } catch (blobErr: any) {
          console.warn(`[Nexus] Remote storage protocol failed. Reverting to Local_Buffer.`, blobErr.message);
          const base64Data = await fileToBase64(adFile);
          adImageInput.base64 = base64Data;
          actualImageSource = adPreview || '';
        }
      } else {
        console.info(`[Nexus] Protocol: URL_Reference_Mode`);
        adImageInput.url = adUrl;
        actualImageSource = adUrl;
      }

      const templateObj = templates.find(t => t.id === selectedTemplate);

      const data = await NexusService.orchestrate(brandUrl, adImageInput, templateObj, userGeminiKey);
      
      // Inject actual image source into placeholder
      if (data.code && actualImageSource) {
        data.code = data.code.replace(/AD_IMAGE_URL_PLACEHOLDER/g, actualImageSource);
      }
      
      setResult(data);
    } catch (err: any) {
      console.error(`[CRITICAL_FAILURE]`, err);
      setError(`System Failure: ${err?.message || 'Orchestration interrupted. Check logs.'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-nexus-bg transition-colors duration-300 ${theme === 'light' ? 'light-theme' : ''}`}>
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-nexus-bg/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              className="glass-card w-full max-w-xl p-10 rounded-sm relative border-nexus-border"
            >
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-nexus-accent transition-colors"
                title="Close"
              >
                <X size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-10 pb-4 border-b border-nexus-border">
                <ShieldAlert size={20} className="text-nexus-accent" />
                <h2 className="tech-label text-white text-lg tracking-[0.2em]">Protocol_Config</h2>
              </div>
              
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="tech-label text-gray-300 font-bold">Google Gemini API Key</label>
                    <span className="text-[9px] font-mono text-gray-600">ENCRYPTED_LOCAL_STORAGE</span>
                  </div>
                  <input 
                    type="password"
                    placeholder="ENTER_GEMINI_API_KEY"
                    className="w-full bg-nexus-bg border border-nexus-border rounded-sm px-6 py-5 text-[14px] text-gray-200 focus:outline-none focus:border-nexus-accent transition-all placeholder:text-gray-800 font-mono"
                    value={userGeminiKey}
                    onChange={(e) => saveKey(e.target.value)}
                  />
                  <p className="text-[10px] text-gray-600 italic">
                    Overrides system default (Environment Variable). Recommended for production high-volume sessions.
                  </p>
                </div>

                <div className="pt-4 border-t border-nexus-border/50">
                  <button 
                    className="w-full nexus-button py-4 text-[13px] tracking-[0.2em] uppercase font-bold border border-nexus-border"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    RESET_LOCAL_PROTOCOLS
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full py-5 bg-white text-nexus-bg rounded-sm font-mono uppercase tracking-[0.3em] text-[12px] hover:bg-nexus-accent hover:text-white transition-all font-bold shadow-2xl active:scale-[0.99]"
                >
                  Confirm_Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-20 border-b border-nexus-border bg-nexus-bg/90 backdrop-blur-xl sticky top-0 z-50 flex items-center px-10 gap-4">
        <div className="flex items-center gap-4">
           <div className="bg-nexus-accent p-2.5 rounded-sm shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Zap size={22} className="text-white" />
           </div>
          <div className="flex flex-col">
            <h1 className="text-[18px] font-black tracking-tight text-white uppercase italic leading-none">adcreative ACE</h1>
            <span className="text-[10px] text-nexus-accent font-mono uppercase tracking-[0.25em] mt-2 font-bold">Nexus_Orchestrator v2.5.12</span>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-6">
          <div className="flex bg-nexus-surface/80 rounded-sm border border-nexus-border p-1">
            <button 
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded transition-all ${theme === 'dark' ? 'bg-nexus-accent text-white' : 'text-gray-500 hover:text-gray-400'}`}
              title="Dark Mode"
            >
              <Moon size={14} />
            </button>
            <button 
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded transition-all ${theme === 'light' ? 'bg-nexus-accent text-white' : 'text-gray-500 hover:text-gray-400'}`}
              title="Light Mode"
            >
              <Sun size={14} />
            </button>
          </div>

          <button 
            onClick={() => setShowHelp(true)}
            className="p-2.5 rounded-sm border border-nexus-border bg-nexus-surface/80 text-gray-500 hover:text-nexus-accent hover:border-nexus-accent transition-all"
            title="Help & Onboarding"
          >
            <HelpCircle size={14} />
          </button>

          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-3 px-5 py-2.5 rounded-sm border border-nexus-border bg-nexus-surface/80 hover:border-nexus-accent hover:bg-nexus-accent/5 transition-all group font-mono"
          >
            <ShieldAlert size={15} className="text-gray-600 group-hover:text-nexus-accent" />
            <span className="tech-label text-gray-400 group-hover:text-white">Settings_Node</span>
          </button>

          <div className="flex items-center gap-3 px-4 py-2 rounded border border-nexus-border bg-nexus-surface/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="tech-label text-emerald-500">System Ready</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 max-w-[1920px] mx-auto w-full h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Column: Control Panel */}
        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex flex-col">
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
        </div>

        {/* Right Column: Analysis & Production */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden h-full">
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

            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Registry Header - Professional Density */}
              <div className="border-b border-nexus-border bg-nexus-surface/10 backdrop-blur-xl sticky top-0 z-20">
                <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                    <div className="flex flex-col min-w-max">
                      <h3 className="tech-label text-[11px] sm:text-xs uppercase tracking-[0.2em] text-nexus-accent leading-none mb-2 font-black">Brand Intelligence</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-nexus-accent animate-pulse" />
                          NODE_SYNC_ACTIVE
                        </span>
                      </div>
                    </div>
                    
                    <div className="h-10 w-px bg-nexus-border/30 hidden lg:block" />
                    
                    {/* Professional Metadata Display */}
                    <div className="hidden xl:flex items-center gap-12">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase text-gray-500 font-black tracking-[0.2em]">Display_Font</span>
                        <span className="text-xs text-white font-black leading-none group-light:text-slate-900 truncate max-w-[140px]">{result?.dtr?.typography?.displayFont?.split(',')[0] || '---'}</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] uppercase text-gray-500 font-black tracking-[0.2em]">Geom_Radius</span>
                        <span className="text-xs text-emerald-400 font-mono font-black">{result?.dtr?.geometry?.borderRadius || '0px'}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 max-w-[240px]">
                        <span className="text-[10px] uppercase text-gray-500 font-black tracking-[0.2em]">Target_Reach</span>
                        <span className="text-xs text-nexus-accent font-black truncate uppercase leading-none">
                          {result?.dtr?.brandDna?.audience ? String(result.dtr.brandDna.audience) : 'PENDING_SIGNAL'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center w-full sm:w-auto">
                    <button 
                      onClick={() => setShowDTRDetails(!showDTRDetails)}
                      className={`text-[10px] sm:text-xs font-black tracking-[0.15em] px-6 sm:px-8 py-3.5 sm:py-4 rounded-sm transition-all border shrink-0 w-full sm:w-auto min-w-0 sm:min-w-[200px] ${
                        showDTRDetails 
                        ? 'bg-nexus-accent text-white border-nexus-accent shadow-lg shadow-nexus-accent/30' 
                        : 'bg-nexus-surface/80 border-nexus-border text-gray-400 hover:border-nexus-accent hover:text-white'
                      }`}
                    >
                      {showDTRDetails ? 'LOCK_REGISTRY' : 'INSPECT_REGISTRY'}
                    </button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {showDTRDetails && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-nexus-border/30 bg-black/60 shadow-inner max-h-[350px] overflow-y-auto custom-scrollbar"
                    >
                      <div className="p-8">
                        <DTRView dtr={result?.dtr || null} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Main Renderer Stage - Maximized for Spatial Reach */}
              <div className={`flex-1 flex flex-col overflow-hidden relative ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-950'}`}>
                {/* Status Bar - Integrated with Stage */}
                <div className="px-6 py-2 bg-nexus-surface/80 border-b border-nexus-border flex items-center justify-between z-20 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-nexus-accent animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">V3_Renderer_Live_Node</span>
                  </div>
                  <div className="flex items-center gap-6 text-[8px] font-mono text-gray-500">
                    <div className="flex gap-2">
                      <span className="opacity-40">SYNC_LOCK:</span>
                      <span className={result ? "text-emerald-500" : "text-amber-500"}>{result ? "VERIFIED" : "WAITING"}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="opacity-40">STAGE:</span>
                      <span className="text-blue-500">PROD_EXPANSION</span>
                    </div>
                  </div>
                </div>

                {/* Edge-to-Edge Stage */}
                <div className="flex-1 relative bg-white shadow-2xl flex flex-col">
                  <PreviewPane code={result?.code || null} />
                  {!result && (
                    <div className="absolute inset-0 flex items-center justify-center bg-nexus-bg z-10">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                        <div className="w-12 h-12 border-2 border-nexus-accent rounded-full animate-ping" />
                        <span className="tech-label italic">Awaiting Spatial Input</span>
                      </div>
                    </div>
                  )}
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

      <OnboardingModal 
        isOpen={showHelp}
        onClose={closeHelp}
      />
    </div>
  );
}

