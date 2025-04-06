export interface SummaryInterface {
  id: string;
  user_id: string;
  original_file_url: string;
  summary_text: string;
  status: string;
  title: string;
  file_name: string;
  createdAt: Date;
  updatedAt: Date;
  word_count?: string;
}
export interface SummaryIdInterface {
  id: string;
  title: string;
  file_name: string;
}
export interface DeleteSummaryInterface {
  summaryId: string;
  // onDelete?: (id: string) => void;
}
