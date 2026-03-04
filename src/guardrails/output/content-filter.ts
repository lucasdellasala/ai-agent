type ContentFilterFn = (content: string) => { passed: boolean; reason?: string };

const filters: ContentFilterFn[] = [];

export function addContentFilter(fn: ContentFilterFn): void {
  filters.push(fn);
}

export function runContentFilters(content: string): { passed: boolean; reasons: string[] } {
  const reasons: string[] = [];

  for (const filter of filters) {
    const result = filter(content);
    if (!result.passed) {
      reasons.push(result.reason ?? 'Content filter failed');
    }
  }

  return { passed: reasons.length === 0, reasons };
}

// Example filter: block responses that leak system prompt patterns
addContentFilter((content) => {
  const leakPatterns = [/system\s*prompt/i, /you\s+are\s+an?\s+AI/i];
  for (const pattern of leakPatterns) {
    if (pattern.test(content)) {
      return { passed: false, reason: 'Response contains system prompt leak indicator' };
    }
  }
  return { passed: true };
});
