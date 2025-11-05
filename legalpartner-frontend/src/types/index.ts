// Document Types
export interface Document {
  document_id: string;
  user: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  file_hash: string;
  document_status: DocumentStatus;
  contract_type?: ContractType;
  extracted_text: string;
  ocr_confidence?: number;
  page_count?: number;
  upload_date: string;
  processed_date?: string;
  metadata: Record<string, any>;
}

export type DocumentStatus = 'uploaded' | 'processing' | 'processed' | 'failed';
export type ContractType = 'rent' | 'mortgage' | 'services' | 'employment' | 'transfers';

// Analysis Types
export interface ContractAnalysis {
  analysis_id: string;
  user: string;
  document: string;
  analysis_state: AnalysisState;
  contract_type?: ContractType;
  analysis_summary: string;
  general_analysis: string;
  overall_favorability?: FavorabilityLevel;
  risk_score?: number;
  total_clauses: number;
  flagged_clauses: number;
  processing_time_seconds?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  analysis_options: Record<string, any>;
  ai_model_info: Record<string, any>;
  clauses?: ContractClause[];
}

export type AnalysisState = 'queued' | 'processing' | 'processed' | 'failed';
export type FavorabilityLevel = 'very_unfavorable' | 'unfavorable' | 'neutral' | 'favorable' | 'very_favorable';

export interface ContractClause {
  clause_id: string;
  contract_analysis: string;
  clause_text: string;
  clause_order: number;
  clause_type: string;
  page_number?: number;
  position_start?: number;
  position_end?: number;
  embedding?: number[];
  created_at: string;
  analysis?: ClauseAnalysis;
}

export interface ClauseAnalysis {
  clause_analysis_id: string;
  contract_clause: string;
  user: string;
  outcome: string;
  favorability_rate: number;
  favorability_level: FavorabilityLevel;
  risk_factors: string[];
  recommendations: string[];
  legal_precedents: string[];
  confidence_score: number;
  related_articles: LegalArticleReference[];
  created_at: string;
}

export interface LegalArticleReference {
  law_name: string;
  article_reference: string;
  similarity_score: number;
  excerpt?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  profile: UserProfile;
  statistics: UserStatistics;
}

export interface UserProfile {
  user_profile_id: string;
  role: UserRole;
  subscription_plan: SubscriptionPlan;
  phone_number: string;
  organization: string;
  job_title: string;
  language_preference: string;
  user_timezone: string;
  receive_notifications: boolean;
}

export type UserRole = 'user' | 'admin' | 'moderator';
export type SubscriptionPlan = 'basic' | 'premium' | 'enterprise';

export interface UserStatistics {
  total_analyses: number;
  total_consultations: number;
  total_documents_uploaded: number;
  avg_risk_score?: number;
  monthly_analyses_count: number;
  monthly_consultations_count: number;
  current_month: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization?: string;
}

export interface UploadOptions {
  contract_type?: ContractType;
  onProgress?: (progress: number) => void;
}

export interface CreateAnalysisData {
  document_id: string;
  contract_type?: ContractType;
  use_rag?: boolean;
  use_together_ai?: boolean;
  deep_analysis?: boolean;
}

// Filter Types
export interface DocumentFilters {
  status?: DocumentStatus;
  contract_type?: ContractType;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface AnalysisFilters {
  status?: AnalysisState;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  search?: string;
  page?: number;
  page_size?: number;
}