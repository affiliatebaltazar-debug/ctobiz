// Module types for AI Growth Command Center

export type AgentStatus = 'active' | 'idle' | 'configuring';

export type AgentCategory =
  | 'Upravljanje'
  | 'Kampanje'
  | 'Sadržaj'
  | 'Društvene mreže'
  | 'Oglašavanje'
  | 'SEO'
  | 'Leadovi'
  | 'Analitika'
  | 'Automatizacija';

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  category: AgentCategory;
  description: string;
  status: AgentStatus;
  icon: string;
}

export type CampaignPlatform = 'Facebook' | 'Instagram' | 'X' | 'Reddit' | 'Google Ads' | 'TikTok' | 'YouTube';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export type ContentType = 'post' | 'video' | 'story' | 'ad' | 'article' | 'email';

export type ContentStatus = 'draft' | 'review' | 'scheduled' | 'published';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected';

export type LeadPriority = 'low' | 'medium' | 'high' | 'critical';

export type AutomationStatus = 'active' | 'paused' | 'error';
