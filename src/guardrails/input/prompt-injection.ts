const INJECTION_PATTERNS: Array<{ pattern: RegExp; label: string; weight: number }> = [
  { pattern: /ignore\s+(all\s+)?previous\s+instructions/i, label: 'ignore_previous', weight: 0.9 },
  { pattern: /you\s+are\s+now\s+/i, label: 'role_override', weight: 0.8 },
  { pattern: /disregard\s+(all\s+)?(prior|previous|above)/i, label: 'disregard_prior', weight: 0.9 },
  { pattern: /forget\s+(everything|all|your)\s+(you|instructions|rules)/i, label: 'forget_instructions', weight: 0.85 },
  { pattern: /new\s+instructions?\s*:/i, label: 'new_instructions', weight: 0.7 },
  { pattern: /system\s*prompt\s*:/i, label: 'system_prompt_leak', weight: 0.8 },
  { pattern: /pretend\s+(you\s+are|to\s+be)/i, label: 'pretend', weight: 0.6 },
  { pattern: /act\s+as\s+(if|a|an)\b/i, label: 'act_as', weight: 0.5 },
  { pattern: /\bDAN\b.*\bmode\b/i, label: 'dan_jailbreak', weight: 0.95 },
  { pattern: /do\s+anything\s+now/i, label: 'dan_jailbreak', weight: 0.95 },
];

export interface InjectionDetectionResult {
  detected: boolean;
  patterns: string[];
  riskScore: number;
}

export function detectPromptInjection(input: string): InjectionDetectionResult {
  const matched: string[] = [];
  let maxScore = 0;

  for (const { pattern, label, weight } of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      matched.push(label);
      maxScore = Math.max(maxScore, weight);
    }
  }

  return {
    detected: matched.length > 0,
    patterns: matched,
    riskScore: maxScore,
  };
}
