export function buildInstallCommand(
  packageManager: "pnpm" | "yarn" | "npm" | "bun",
  packages: string[],
  isLocal = false,
): string {
  if (isLocal) {
    switch (packageManager) {
      case "pnpm":
        return `pnpm add ${packages.map((p) => `${p}@workspace:*`).join(" ")}`;
      case "yarn":
        return `yarn add ${packages.map((p) => `${p}@portal:`).join(" ")}`;
      case "npm":
      case "bun":
        // Resolves packages to relative monorepo folders
        return `npm install ${packages.map((p) => `file:../../packages/${p.replace("@asheeui/", "")}`).join(" ")}`;
    }
  }

  // Non-local fallback
  switch (packageManager) {
    case "pnpm":
      return `pnpm add ${packages.join(" ")}`;
    case "yarn":
      return `yarn add ${packages.join(" ")}`;
    case "npm":
      return `npm install ${packages.join(" ")}`;
    case "bun":
      return `bun add ${packages.join(" ")}`;
  }
}
