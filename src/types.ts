export interface FetchStatus {
  loading?: true;
  success?: true;
  error?: string;
}

export interface ApmVersion {
  contentUri: string;
  semanticVersion: string;
}
