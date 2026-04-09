export interface ImportResult {
  created: number;
  skipped: number;
  failed: number;
  errors: { url: string; reason: string }[];
}
