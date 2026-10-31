/**
 * Settings: the account, the theme and the two layers a settings screen needs.
 *
 * `useTheme` and `themeController` are the theme engine; the form exercises the field
 * family; the `Modal` and `Drawer` are the destructive and informational layers.
 */
import {
  Alert,
  Avatar,
  Badge,
  Button,
  CopyButton,
  Drawer,
  Dropmenu,
  Form,
  Grid,
  HStack,
  Input,
  Modal,
  Radio,
  RadioGroup,
  Switch,
  Typography,
  type ThemeSelection,
  useTheme,
  useToast,
  VStack,
} from "asheeui";
import { useState } from "react";
import { Panel, ScreenHeading } from "../components";
import { profile } from "../data";
import type { ScreenProps } from "../theme";

const UNITS = [
  { label: "Metric (kg, km)", value: "metric" },
  { label: "Imperial (lb, mi)", value: "imperial" },
];

const THEME_LABELS: Record<string, string> = {
  system: "Match the device",
  light: "Light",
  dark: "Dark",
};

/** Settings. */
export function SettingsScreen(_props: ScreenProps) {
  const toast = useToast();
  const { theme, resolvedTheme, setTheme, availableThemes } = useTheme();
  const [units, setUnits] = useState("metric");
  const [notifications, setNotifications] = useState(true);
  const [weekly, setWeekly] = useState("three");
  const [deleting, setDeleting] = useState(false);
  const [shortcuts, setShortcuts] = useState(false);
  const [email, setEmail] = useState("maya@example.com");

  const themes: string[] = ["system", ...availableThemes];

  return (
    <VStack gap="xl">
      <ScreenHeading
        eyebrow="Account"
        title="Settings"
        description={`${profile.name} · ${profile.plan} · member since ${profile.memberSince}`}
        actions={
          <Button variant="ghost" onPress={() => setShortcuts(true)}>
            Keyboard shortcuts
          </Button>
        }
      />

      <Grid columns={1} columnsLg={3} gap="lg">
        <Panel title="Profile" description="The details your coach sees.">
          <VStack gap="md">
            <HStack gap="md" align="center">
              <Avatar name={profile.name} size="lg" />
              <VStack gap="xs">
                <Typography role="heading-sm">{profile.name}</Typography>
                <Typography role="caption" tone="muted">
                  {profile.plan} plan · {profile.streakDays}-day streak
                </Typography>
              </VStack>
            </HStack>
            <Form
              legend="Account details"
              submitLabel="Save profile"
              onSubmit={() => {
                toast.success("Profile saved");
              }}
            >
              <Input label="Name" defaultValue={profile.name} />
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                description="Used for the weekly summary and nothing else."
              />
              <Dropmenu
                label="Units"
                options={UNITS}
                value={units}
                onValueChange={(value) => setUnits(String(value))}
              />
            </Form>
            <CopyButton value={email} label="Copy your email" variant="bordered" />
          </VStack>
        </Panel>

        <Panel title="Theme" description="The state machine both renderers share.">
          <VStack gap="md">
            <HStack justify="between" align="center">
              <Typography role="body-sm" tone="muted">
                Selected
              </Typography>
              <Badge color="primary" variant="faded" size="sm">
                {THEME_LABELS[theme] ?? theme}
              </Badge>
            </HStack>
            <HStack justify="between" align="center">
              <Typography role="body-sm" tone="muted">
                Resolved
              </Typography>
              <Badge color="secondary" variant="bordered" size="sm">
                {resolvedTheme}
              </Badge>
            </HStack>
            <VStack gap="sm">
              {themes.map((choice) => (
                <Button
                  key={choice}
                  variant={theme === choice ? "solid" : "bordered"}
                  size="sm"
                  onPress={() => setTheme(choice as ThemeSelection)}
                >
                  {THEME_LABELS[choice] ?? choice}
                </Button>
              ))}
            </VStack>
            <Typography role="caption" tone="muted">
              The choice is stored by the platform: a document preference on the web, the
              application's storage adapter on a device.
            </Typography>
          </VStack>
        </Panel>

        <Panel title="Training preferences" description="What the plan does with your week.">
          <VStack gap="md">
            <RadioGroup
              label="Sessions per week"
              value={weekly}
              onChange={setWeekly}
              orientation="vertical"
            >
              <Radio value="two" label="Two" description="Minimum effective dose" />
              <Radio value="three" label="Three" description="The programme default" />
              <Radio value="five" label="Five" description="Performance block" />
            </RadioGroup>
            <Switch
              label="Session reminders"
              description="Thirty minutes before the planned slot."
              checked={notifications}
              onChange={setNotifications}
            />
            <Switch label="Coach messages" description="Only when your coach writes." />
            <Button variant="bordered" onPress={() => setDeleting(true)}>
              Delete account
            </Button>
          </VStack>
        </Panel>
      </Grid>

      <Alert type="warning" title="This is a demo account" isClosable>
        The data in this tracker is a fixture. Nothing is sent anywhere, and deleting the
        account only closes this dialog.
      </Alert>

      <Modal isOpen={deleting} onClose={() => setDeleting(false)} size="sm">
        <VStack gap="md">
          <Typography role="heading-md">Delete the account?</Typography>
          <Typography role="body-sm" tone="muted">
            The training history, the studio page and the coaching thread would go with it.
            Export the records first if you want them.
          </Typography>
          <HStack justify="end" gap="sm">
            <Button variant="ghost" onPress={() => setDeleting(false)}>
              Keep the account
            </Button>
            <Button color="danger" onPress={() => setDeleting(false)}>
              Delete
            </Button>
          </HStack>
        </VStack>
      </Modal>

      <Drawer
        isOpen={shortcuts}
        onClose={() => setShortcuts(false)}
        placement="right"
        size="sm"
      >
        <VStack gap="md">
          <Typography role="heading-md">Keyboard shortcuts</Typography>
          <Typography role="body-sm" tone="muted">
            The web application listens for these; a device has its own gestures, which is why
            the drawer is the honest place to state them.
          </Typography>
          <VStack gap="sm">
            {[
              ["G then T", "Today"],
              ["G then W", "Workouts"],
              ["G then P", "Progress"],
              ["⌘ K", "Search the library"],
              ["Esc", "Close a layer"],
            ].map(([keys, action]) => (
              <HStack key={keys} justify="between" align="center">
                <Badge variant="bordered" size="sm">
                  {keys}
                </Badge>
                <Typography role="body-sm">{action}</Typography>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Drawer>
    </VStack>
  );
}
