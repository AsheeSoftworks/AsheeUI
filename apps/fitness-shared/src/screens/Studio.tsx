/**
 * Studio: the page the visual editor composed.
 *
 * The same stored document is rendered by `PuckPage` on both platforms — the editor's own
 * renderer on the web, the native renderer on a device. On the web the shell also offers
 * the editor; this screen is what a member sees when they are not editing.
 */
import { PuckPage, type AsheePuckData } from "@asheeui/puck";
import { Badge, Button, Card, HStack, Typography, VStack } from "asheeui";
import { Panel, ScreenHeading } from "../components";
import type { ScreenProps } from "../theme";

/** The page a new member starts with; the editor publishes over it. */
export const studioPage: AsheePuckData = {
  root: { props: {} },
  content: [
    {
      type: "Heading",
      props: {
        id: "heading-studio",
        eyebrow: "Your studio",
        title: "A dashboard that fits the way you train",
        description:
          "Compose the report you actually read: the numbers you care about, in the order that helps you decide what to do next.",
        align: "center",
      },
    },
    {
      type: "FeatureGrid",
      props: {
        id: "features-studio",
        title: "Blocks you can arrange",
        description: "Drag them in the editor on the web; the device renders the same page.",
        items: [
          {
            title: "Training load",
            description: "Minutes and intensity, week over week.",
          },
          {
            title: "Recovery",
            description: "Sleep, resting heart rate and how you feel.",
          },
          {
            title: "Nutrition",
            description: "Protein first, then the rest of the plate.",
          },
        ],
        columnsMd: "2",
        columnsLg: "3",
        align: "center",
        background: "none",
      },
    },
    {
      type: "Text",
      props: {
        id: "text-studio",
        text: "Every block on this page is an AsheeUI component. The editor stores the composition and each platform renders it with its own renderer, so a page built in a browser is the same page on a phone.",
        align: "center",
      },
    },
    {
      type: "CTA",
      props: {
        id: "cta-studio",
        eyebrow: "Your week",
        title: "Three sessions, one long walk",
        description: "The plan is a suggestion; the studio is where you make it yours.",
        primaryAction: { label: "Open the workout library", href: "/workouts", variant: "solid" },
        align: "center",
        panel: "bordered",
        background: "none",
      },
    },
  ],
};

/** Studio. */
export function StudioScreen({
  onNavigate,
  data,
  onEdit,
}: ScreenProps & { data?: AsheePuckData; onEdit?: () => void }) {
  return (
    <VStack gap="xl">
      <ScreenHeading
        eyebrow="Compose"
        title="Studio"
        description="A page built with the Puck integration and rendered by the same package on both platforms."
        actions={
          <>
            {onEdit ? (
              <Button variant="bordered" onPress={onEdit}>
                Edit this page
              </Button>
            ) : null}
            <Button variant="ghost" onPress={() => onNavigate("dashboard")}>
              Back to today
            </Button>
          </>
        }
      />

      <Card variant="bordered" size="md">
        <HStack justify="between" align="center" gap="md" wrap>
          <VStack gap="xs">
            <Typography role="heading-sm">One document, two renderers</Typography>
            <Typography role="body-sm" tone="muted">
              On the web the editor is beside this page; on a device the same stored blocks are
              drawn by the native renderer. No block is web-only.
            </Typography>
          </VStack>
          <HStack gap="sm">
            <Badge color="primary" variant="faded" size="sm">
              Puck
            </Badge>
            <Badge color="success" variant="faded" size="sm">
              portable
            </Badge>
          </HStack>
        </HStack>
      </Card>

      <Panel title="Rendered page" description="The composition as a member sees it.">
        <PuckPage data={data ?? studioPage} />
      </Panel>
    </VStack>
  );
}
