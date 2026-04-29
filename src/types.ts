export interface AgentLog {
  id: string;
  agentName: string;
  agentRole: string;
  message: string;
  timestamp: string;
  status: 'processing' | 'completed' | 'error';
}

export interface DesignTokenRegistry {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    ink: string;
  };
  typography: {
    displayFont: string;
    bodyFont: string;
    monoFont: string;
  };
  geometry: {
    borderRadius: string;
    spacingUnit: string;
    containerWidth: string;
  };
  brandDna: {
    voice: string;
    tone: string;
    audience: string;
    hooks?: string[];
  };
}

export interface LandingPageResult {
  code: string;
  dtr: DesignTokenRegistry;
  logs: AgentLog[];
}
