import { useSettings } from "@ashee/settings";
import { useTheme } from "@ashee/theme/useTheme";
import {
  Button,
  Container,
  Flex,
  Grid,
  Input,
  TextArea,
  useAsheeConfig,
} from "@ashee/ui";

function AppInner() {
  const { resolvedTheme } = useTheme();
  const { settings, update } = useSettings();
  const config = useAsheeConfig();
  console.log(config.theme.radius);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
            ashee monorepo
          </p>
          <h1 className="text-3xl font-semibold">
            Workspace packages are wired up
          </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Current theme</p>
            <p className="mt-2 text-xl font-medium">{resolvedTheme}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-400">Settings status</p>
            <p className="mt-2 text-xl font-medium">
              {settings.enableAnimations ? "Animations on" : "Animations off"}
            </p>
          </div>
        </div>
        <div className="rounded-lg shadow-md">
          <p className="text-xl leading-tall tracking-wide font-sans">
            Testing design tokens
          </p>
        </div>
        <Container>
          <Flex justify="between">
            <Grid columns={3}>.................</Grid>
          </Flex>
        </Container>
        <Button variant="secondary">Test Button</Button>
        <Input
          label="Email address"
          labelAlign="left"
          description="We'll never share this with anyone else."
          status="error"
          message="Please enter a valid email."
          required
        />
        <TextArea
          label="Bio"
          labelAlign="center"
          status="success"
          message="Looks good!"
          rows={6}
        />

        <Input placeholder="Search..." />
        <button
          type="button"
          className="w-fit rounded-lg border-2 border-red-500 bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400"
          onClick={() => {
            const order: (typeof settings.theme)[] = [
              "light",
              "dark",
              "white",
              "black",
              "company-red",
            ];
            const next =
              order[(order.indexOf(settings.theme) + 1) % order.length];
            update({ theme: next });
          }}>
          Cycle theme ({settings.theme})
        </button>
      </div>
    </main>
  );
}

function App() {
  return <AppInner />;
}

export default App;
