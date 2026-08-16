export type Framework = "next" | "vite-react" | "tanstack-start" | "unknown";
export type SupportedFramework = Exclude<Framework, "unknown">;
export type FrameworkConfidence = "high" | "medium" | "low";
export type Language = "typescript" | "javascript";
export type NextRouter = "app" | "pages";
export type PackageManager = "pnpm" | "yarn" | "npm";

export interface FrameworkDetection {
  framework: Framework;
  confidence: FrameworkConfidence;
  evidence: string[];
}

export interface ProjectStructure {
  entryPoint: string | null;
  language: Language;
  nextRouter: NextRouter | null;
  hasTailwind: boolean;
  hasGlobalCss: boolean;
}

export interface DetectedProject {
  directory: string;
  detection: FrameworkDetection;
  structure: ProjectStructure;
}

export interface IntegrationContext {
  directory: string;
  framework: SupportedFramework;
  structure: ProjectStructure;
}

export interface InitOptions {
  template: string;
  yes: boolean;
}

export interface InitResult {
  framework: SupportedFramework;
  filesCreated: string[];
  filesModified: string[];
  dependenciesInstalled: string[];
}

export interface IntegrityCheck {
  projectRelativeFile: string;
  pattern: string;
  message: string;
}

export interface FileWrite {
  path: string;
  content: string;
}

export interface FileEdit {
  path: string;
  search: string;
  replace: string;
  all?: boolean;
  notFoundMessage?: string;
}

export interface IntegrationResult {
  fileWrites: FileWrite[];
  fileEdits: FileEdit[];
  integrityChecks: IntegrityCheck[];
  dependenciesToInstall: string[];
  summary: string[];
}
