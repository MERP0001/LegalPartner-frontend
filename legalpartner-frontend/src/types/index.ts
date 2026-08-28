// Document Types
export interface Document {
  document_id: string;
  user: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  file_size_formatted?: string;
  mime_type: string;
  file_hash: string;
  document_status: DocumentStatus;
  status_display?: string;
  contract_type?: ContractType;
  contract_type_display?: string;
  extracted_text: string;
  ocr_confidence?: number;
  page_count?: number;
  upload_date: string;
  processed_date?: string;
  metadata: Record<string, unknown>;
}

export type DocumentStatus = 'uploaded' | 'processing' | 'processed' | 'failed';
export type ContractType = 'rent' | 'mortgage' | 'services' | 'employment' | 'transfers';

// Analysis Types
export interface ContractAnalysis {
  analysis_id: string;
  user: string;
  document: string | Document;
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
  analysis_options: Record<string, unknown>;
  ai_model_info: Record<string, unknown>;
  clauses?: ContractClause[];
  document_filename?: string;
  document_id?: string;
  document_name?: string;
  is_completed?: boolean;
  is_processing?: boolean;
  is_failed?: boolean;
  high_risk_clauses_count?: number;
  average_favorability?: number;
  completion_percentage?: number;
  // Campos de polling
  progress_percentage?: number;
  current_step?: string;
  estimated_time_remaining?: number;
  error_message?: string;
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
  text_preview?: string;
  has_analysis?: boolean;
}

export interface ClauseAnalysis {
  clause_analysis_id: string;
  contract_clause: string;
  user: string;
  outcome: string;
  favorability_rate: number;
  favorability_level: FavorabilityLevel;
  is_high_risk: boolean;
  risk_factors: string[];
  recommendations: string[];
  confidence_score: number;
  related_articles: LegalArticleReference[];
  created_at: string;
}

export interface LegalArticleReference {
  article_id?: string;
  law_name: string;
  article_reference: string;
  relevance: string;
  similarity_score?: number;
  excerpt?: string;
  content?: string;
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
  error?: unknown;
  errors?: unknown;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    page: number;
    page_size: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
  };
  message?: string;
  error?: unknown;
  errors?: unknown;
}

export interface AnalysisListResponse {
  success: boolean;
  data: ContractAnalysis[];
  pagination?: {
    page: number;
    page_size: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
  };
  message?: string;
  error?: unknown;
  errors?: unknown;
}

export interface DocumentStats {
  total_documents: number;
  documents_by_status: Record<string, number>;
  storage_usage: Record<string, unknown>;
  monthly_usage: Record<string, unknown>;
  recent_uploads: Document[];
  processing_summary: {
    processed_count: number;
    processing_rate: number;
    avg_ocr_confidence: number;
    total_pages: number;
  };
}

// Chatbot Types
export interface ConsultationSource {
  type: string;
  article_reference?: string;
  relevance_score?: number;
  excerpt?: string;
}

export interface ConsultationResponseData {
  consultation_id: string;
  question: string;
  response: string;
  confidence_score: number;
  response_time_seconds: number;
  sources: ConsultationSource[];
  related_questions: string[];
  created_at: string;
}
