export interface ServiceToggleItem {
  key: string;
  label: string;
  helper: string;
}

export type ServiceToggleState = Record<string, boolean>;
