export interface PDFSummaryTypes {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export interface SavedSummary {
  id: string;
  summary_text: string;
}

export interface UploadResponseItem {
  serverData: {
    userId: string;
    file: {
      url: string;
      name: string;
    };
  };
}

export interface SummaryResult {
  success: boolean;
  message: string;
  data: {
    title: string;
    summary: string;
  } | null;
}

export interface StoreSummaryResult {
  success: boolean;
  message: string;
  data?: {
    id: string;
    summary: string;
  };
}
