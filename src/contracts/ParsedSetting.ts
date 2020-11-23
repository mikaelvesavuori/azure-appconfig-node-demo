/**
 * @description The setting when parsed from Azure App Configuration
 */
export type ParsedSetting = {
  id: string;
  description: string;
  enabled: boolean;
  conditions: Record<string, unknown>;
};
