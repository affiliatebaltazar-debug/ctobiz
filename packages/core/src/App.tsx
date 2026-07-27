import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LoadingFallback from './components/ui/LoadingFallback';
import type { RouteDefinition } from './types';

// Lazy core pages
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Lazy module pages
const AIAgents = lazy(() => import('@base44/ai-growth-command-center/pages/AIAgents'));
const CampaignIntelligence = lazy(() => import('@base44/ai-growth-command-center/pages/CampaignIntelligence'));
const ContentFactory = lazy(() => import('@base44/ai-growth-command-center/pages/ContentFactory'));
const SocialMediaIntelligence = lazy(() => import('@base44/ai-growth-command-center/pages/SocialMediaIntelligence'));
const AdvertisingIntelligence = lazy(() => import('@base44/ai-growth-command-center/pages/AdvertisingIntelligence'));
const SEOBacklinkIntelligence = lazy(() => import('@base44/ai-growth-command-center/pages/SEOBacklinkIntelligence'));
const LeadGeneration = lazy(() => import('@base44/ai-growth-command-center/pages/LeadGeneration'));
const Analytics = lazy(() => import('@base44/ai-growth-command-center/pages/Analytics'));
const AutomationCenter = lazy(() => import('@base44/ai-growth-command-center/pages/AutomationCenter'));
const Integrations = lazy(() => import('@base44/ai-growth-command-center/pages/Integrations'));
const SettingsPage = lazy(() => import('@base44/ai-growth-command-center/pages/Settings'));

const allRoutes: RouteDefinition[] = [
  { path: '/', element: <Dashboard /> },
  { path: '/agenti', element: <AIAgents /> },
  { path: '/kampanje', element: <CampaignIntelligence /> },
  { path: '/sadrzaj', element: <ContentFactory /> },
  { path: '/social', element: <SocialMediaIntelligence /> },
  { path: '/oglasi', element: <AdvertisingIntelligence /> },
  { path: '/seo', element: <SEOBacklinkIntelligence /> },
  { path: '/leadovi', element: <LeadGeneration /> },
  { path: '/analitika', element: <Analytics /> },
  { path: '/automatizacija', element: <AutomationCenter /> },
  { path: '/integracije', element: <Integrations /> },
  { path: '/postavke', element: <SettingsPage /> },
];

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {allRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<Suspense fallback={<LoadingFallback />}>{element}</Suspense>}
          />
        ))}
      </Route>
    </Routes>
  );
}
