import type { ProjectStructure } from "../common/types";

/**
 * A single action the init flow is about to perform.
 */
export interface PlannedAction {
  /** High-level category of action. */
  type: "write" | "edit" | "install";
  /** Human-readable description of the action. */
  description: string;
}

/**
 * Aggregated execution plan shown to the user before applying changes.
 */
export interface InitPlan {
  /** Ordered list of actions about to be performed. */
  actions: PlannedAction[];
  /** Human-readable summary lines from the integration builder. */
  summary: string[];
}

/**
 * Compose an {@link InitPlan} from the integration summary, the list of
 * missing dependencies, and the detected project structure.
 *
 * A `write` action is emitted for each line in `integrationSummary`, an
 * `install` action for each missing dependency, and a single `edit`
 * action when the project already has a global stylesheet (so the
 * init flow will inject the asheeui import into it).
 *
 * @param integrationSummary - Lines produced by the integration builder.
 * @param missingDependencies - Package names that still need to be installed.
 * @param structure - Detected project structure.
 * @returns A populated {@link InitPlan}.
 */
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
