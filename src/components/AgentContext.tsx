import React, { useEffect, useState, createContext, useContext } from 'react';
export type AgentType = 'availability' | 'onboarding' | 'compliance' | 'general';
interface ConversationState {
  lastAssistantQuestion: string | null;
  pendingFields: string[];
  currentAgent: AgentType;
  entryRoute: AgentType;
  recentEntity: string | null;
  lastCardId: string | null;
  lastActionRequired: boolean;
}
interface AgentContextType {
  activeAgent: AgentType;
  setActiveAgent: (agent: AgentType) => void;
  agentState: Record<string, any>;
  updateAgentState: (agentType: AgentType, data: any) => void;
  conversationState: ConversationState;
  updateConversationState: (updates: Partial<ConversationState>) => void;
  temporaryAgentSwitch: (agent: AgentType, onComplete: () => void) => void;
  isTemporaryAgentActive: boolean;
  resetTemporaryAgent: () => void;
}
const AgentContext = createContext<AgentContextType | undefined>(undefined);
const STORAGE_KEY = 'arya_health_chat_state';
export const AgentProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [activeAgent, setActiveAgent] = useState<AgentType>('availability');
  const [isTemporaryAgentActive, setIsTemporaryAgentActive] = useState(false);
  const [temporaryAgentCallback, setTemporaryAgentCallback] = useState<(() => void) | null>(null);
  const [conversationState, setConversationState] = useState<ConversationState>({
    lastAssistantQuestion: null,
    pendingFields: [],
    currentAgent: 'availability',
    entryRoute: 'availability',
    recentEntity: null,
    lastCardId: null,
    lastActionRequired: false
  });
  const [agentState, setAgentState] = useState<Record<string, any>>({
    availability: {
      availability: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      },
      distance: 15,
      rate: {
        min: 25,
        max: 35
      },
      constraints: []
    },
    onboarding: {
      basicInfo: {
        name: '',
        email: '',
        phone: ''
      },
      license: {
        type: '',
        number: ''
      },
      skills: {
        yearsExperience: 0,
        specialties: []
      },
      workPreferences: {
        rate: {
          min: 25,
          max: 35
        },
        availability: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        },
        distance: 15,
        constraints: []
      }
    },
    compliance: {
      credentials: [],
      currentCredential: null,
      uploadedDocument: null,
      extractedData: null
    }
  });
  // Load state from sessionStorage on initial render
  useEffect(() => {
    const savedState = sessionStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const {
          agentState: savedAgentState,
          conversationState: savedConversationState
        } = JSON.parse(savedState);
        if (savedAgentState) setAgentState(savedAgentState);
        if (savedConversationState) setConversationState(savedConversationState);
        if (savedConversationState?.currentAgent) setActiveAgent(savedConversationState.currentAgent);
      } catch (e) {
        console.error('Error parsing saved state:', e);
      }
    }
  }, []);
  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      agentState,
      conversationState
    }));
  }, [agentState, conversationState]);
  const updateAgentState = (agentType: AgentType, data: any) => {
    setAgentState(prev => ({
      ...prev,
      [agentType]: {
        ...prev[agentType],
        ...data
      }
    }));
  };
  const updateConversationState = (updates: Partial<ConversationState>) => {
    setConversationState(prev => ({
      ...prev,
      ...updates
    }));
  };
  // Temporary agent switch function
  const temporaryAgentSwitch = (agent: AgentType, onComplete: () => void) => {
    setIsTemporaryAgentActive(true);
    setActiveAgent(agent);
    setTemporaryAgentCallback(() => onComplete);
  };
  // Reset temporary agent and call the callback
  const resetTemporaryAgent = () => {
    if (temporaryAgentCallback) {
      temporaryAgentCallback();
    }
    setIsTemporaryAgentActive(false);
    setTemporaryAgentCallback(null);
    setActiveAgent(conversationState.currentAgent);
  };
  return <AgentContext.Provider value={{
    activeAgent,
    setActiveAgent,
    agentState,
    updateAgentState,
    conversationState,
    updateConversationState,
    temporaryAgentSwitch,
    isTemporaryAgentActive,
    resetTemporaryAgent
  }}>
      {children}
    </AgentContext.Provider>;
};
export const useAgent = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
};