import type { ProjectStructure } from "./types";

export interface PlannedAction {
  type: "write" | "edit" | "install";
  description: string;
}

export interface InitPlan {
  actions: PlannedAction[];
  summary: string[];
}

export function buildPlan(
  integrationSummary: string[],
  missingDependencies: string[],
  structure: ProjectStructure,
): InitPlan {
  const actions: PlannedAction[] = [];

  for (const summary of integrationSummary) {
    actions.push({
      type: "write",
      description: summary,
    });
  }

  for (const dep of missingDependencies) {
    actions.push({
      type: "install",
      description: `install ${dep}`,
    });
  }

  if (structure.hasGlobalCss) {
    actions.push({
      type: "edit",
      description: "import global CSS",
    });
  }

  return {
    actions,
    summary: integrationSummary,
  };
}
