export interface ReelItem {
  id?: string;
  url: string;
  domain: string;
  subdomain: string;
  category?: string;
  creator?: string;
  subject: string;
  personalUtility?: string;
  entities?: string;
  tags?: string;
  summary: string;
  aiResponse?: string;
  caption?: string;
  date?: string;
  postedDate?: string;
  timestamp?: number | string;
}

export interface TaxonomyTree {
  [domain: string]: string[];
}

export type ViewMode = 'grid' | 'table';

export interface EntitySummary {
  name: string;
  count: number;
  domains: string[];
  reels: ReelItem[];
}

export interface AnalyticsStats {
  uniqueVisitors: number;
  totalPageViews: number;
  reelsCount: number;
  domainsCount: number;
}
