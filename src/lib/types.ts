export type PriorityInsightType = "growth" | "warning" | "alert" | "tip";

export interface PriorityInsight {
  type: PriorityInsightType;
  text: string;
}

export interface KPIInput {
  revenue: number;
  new_users: number;
  conversion_rate: number;
  ad_spend: number;
  notes?: string;
}

export interface GeneratedReport {
  priority_insights: PriorityInsight[];
  business_overview: string;
  key_trends: string;
  risks_alerts: string;
  opportunities: string;
  daily_actions: [string, string, string];
}

export interface KPIEntry extends KPIInput {
  id: string;
  user_id: string;
  created_at: string;
}

export interface Report extends GeneratedReport {
  id: string;
  user_id: string;
  kpi_entry_id: string;
  created_at: string;
}
