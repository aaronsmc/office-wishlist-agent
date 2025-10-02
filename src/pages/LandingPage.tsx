import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircleIcon, MicIcon, ArrowRightIcon } from 'lucide-react';
import { useAgent } from '../components/AgentContext';
import { HeroAnimation } from '../components/landing/HeroAnimation';
import { ActionTile } from '../components/landing/ActionTile';
import { SmartSuggestion } from '../components/landing/SmartSuggestion';
import { AboutSheet } from '../components/landing/AboutSheet';
import { AnimatedLogo } from '../components/AnimatedLogo';
export const LandingPage = () => {
  const navigate = useNavigate();
  const {
    agentState,
    conversationState
  } = useAgent();
  const [showAboutSheet, setShowAboutSheet] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const animationContainerRef = useRef<HTMLDivElement>(null);
  // Check if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);
  // Handle navigation to specific routes
  const handleNavigate = (route: string) => {
    navigate(route);
  };
  // Handle start chat button
  const handleStartChat = () => {
    navigate('/chat');
  };
  // Check if there are any expiring credentials
  const hasExpiringCredentials = () => {
    const credentials = agentState.compliance?.credentials || [];
    return credentials.some((cred: any) => cred.daysUntilExpiry <= 30);
  };
  // Get the days until expiry for the soonest expiring credential
  const getDaysUntilExpiry = () => {
    const credentials = agentState.compliance?.credentials || [];
    if (credentials.length === 0) return null;
    const soonestExpiring = credentials.reduce((soonest: any, current: any) => {
      if (!soonest || current.daysUntilExpiry < soonest.daysUntilExpiry) {
        return current;
      }
      return soonest;
    }, null);
    return soonestExpiring ? {
      days: soonestExpiring.daysUntilExpiry,
      type: soonestExpiring.type
    } : null;
  };
  // Check if there's a session to continue
  const hasActiveSession = () => {
    return conversationState.lastCardId !== null;
  };
  return <div className="relative min-h-screen bg-theme-gradient flex flex-col items-center overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-teal-500/10 rounded-full blur-[100px] opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-emerald-500/10 rounded-full blur-[100px] opacity-30" />
      </div>
      {/* Top bar */}
      <div className="w-full z-10 bg-white/40 backdrop-blur-xl border-b border-theme p-4 flex items-center justify-center">
        <div className="flex items-center">
          <AnimatedLogo className="h-8" />
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col items-center justify-start pt-8 px-4">
        {/* Restored AnimatedLogo component */}
        <div className="w-full flex items-center justify-center mb-8">
          <AnimatedLogo className="h-30 my-5" />
        </div>
        {/* Welcome text */}
        <h1 className="text-primary text-xl font-light mb-12">Hi, I'm Mavi.</h1>
        {/* Primary action tiles */}
        <div className="w-full space-y-4">
          <ActionTile title="Manage Working Preferences" subtitle="Tell Mavi when you can work." ctaText="Open preferences" icon="calendar" onClick={() => handleNavigate('/workpreferences-2')} />
          <ActionTile title="Finish Onboarding" subtitle="Complete your profile in minutes." ctaText="Open onboarding" icon="user" onClick={() => handleNavigate('/new-user')} />
          <ActionTile title="Renew Credentials" subtitle="Stay compliant, keep working." ctaText="Open compliance" icon="file" onClick={() => handleNavigate('/compliance')} />
        </div>
        {/* Smart suggestions (if applicable) */}
        <div className="w-full mt-8 space-y-2">
          {hasActiveSession() && <SmartSuggestion text="Continue where you left off" onClick={() => {
          if (conversationState.currentAgent) {
            navigate(`/${conversationState.currentAgent}`);
          }
        }} />}
          {hasExpiringCredentials() && getDaysUntilExpiry() && <SmartSuggestion text={`${getDaysUntilExpiry()?.type} expires in ${getDaysUntilExpiry()?.days} days — renew now`} onClick={() => navigate('/compliance')} />}
        </div>
        {/* Footer and chat button */}
        <div className="w-full mt-auto mb-8 pt-8 flex flex-col items-center">
          <p className="text-tertiary text-xs text-center mb-4">
            Mavi helps you manage your schedule, complete your profile, and stay
            compliant.
          </p>
          <div className="flex items-center space-x-4">
            <button onClick={handleStartChat} className="px-6 py-2.5 bg-black/5 hover:bg-black/10 text-gray-800 border-black/10 rounded-full border backdrop-blur-md flex items-center space-x-2 transition-all hover:shadow-glow">
              <span>Start chat</span>
              <ArrowRightIcon size={16} />
            </button>
            <button className="p-2.5 bg-black/5 hover:bg-black/10 text-gray-800 border-black/10 rounded-full border backdrop-blur-md transition-all hover:shadow-glow" aria-label="Hold to speak" title="Hold to speak">
              <MicIcon size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* About sheet */}
      {showAboutSheet && <AboutSheet onClose={() => setShowAboutSheet(false)} />}
    </div>;
};