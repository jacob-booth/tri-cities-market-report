export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  title: string;
  data: Record<string, any>[];
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Section {
  id: string;
  title: string;
  tldr: string;
  content: string[];
  charts?: ChartData[];
  swot?: SWOTData;
}

export interface Citation {
  id: number;
  title: string;
  url: string;
  context: string;
}

export interface KeyMetrics {
  populationGrowth: number;
  populationGrowthPercent: number;
  medianHomePrice: number;
  homePriceGrowth: number;
  consumerSpendingGrowth: number;
}

export interface ReportData {
  metadata: {
    title: string;
    subtitle: string;
    date: string;
    author: string;
  };
  keyMetrics: KeyMetrics;
  sections: Section[];
  citations: Citation[];
} 