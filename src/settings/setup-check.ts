export interface SetupRequirement {
  id: string;
  status: "ok" | "blocking" | "warning";
  message?: string;
  actions?: { value: string }[];
}

export interface SetupCheckResult {
  status: "ok" | "blocking";
  canStart: boolean;
  requirements: SetupRequirement[];
}

export interface SetupState {
  completedAt: number;
  lastCheckedAt: number;
  dismissedVersion: string;
}

export function buildSetupCheck(settings: any, status?: any, options?: any): SetupCheckResult {
  return { status: "ok", canStart: true, requirements: [] };
}

export function completeSetupState(state: SetupState, completedAt: number, version: string): SetupState {
  return { completedAt, lastCheckedAt: completedAt, dismissedVersion: version };
}
