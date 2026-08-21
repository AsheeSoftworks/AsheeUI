export type DoctorStatus = "pass" | "warn" | "fail" | "info";

export interface DoctorCheckResult {
  id: string;
  title: string;
  status: DoctorStatus;
  message: string;
  fix?: string;
}

export interface DoctorOptions {
  cwd: string;
}
