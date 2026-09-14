export interface ReelItem {
  id?: string;
  url: string;
  domain: string;
  subdomain: string;
  category?: string;
  subject: string;
  personalUtility?: string;
  entities?: string;
  tags?: string;
  summary: string;
  caption?: string;
  date?: string;
  postedDate?: string;
  timestamp?: number | string;
}

export interface TaxonomyTree {
  [domain: string]: string[];
}

export type ViewMode = 'grid' | 'table' | 'flashcard';

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
