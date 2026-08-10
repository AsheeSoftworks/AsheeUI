import {
  Button,
  Container,
  Flex,
  Grid,
  H2,
  Input,
  P,
  Spinner,
  TextArea,
} from "@ashee/ui";
import { useState } from "react";

export function LocalOverridesPage() {
  const [checking, setChecking] = useState(false);

  return (
    <Container
      maxWidth="sm"
      padding="xs"
      margin="xl"
      center={false}
      className="border border-border">
      <H2 as={1} className="italic">
        H2 rendered as H1 tag, italic via className
      </H2>
      <P size="sm">
        This paragraph overrides only `size` — weight/lineHeight/family still
        come from config, since those aren't instance props on P by design.
      </P>

      <H2>Buttons — every axis overridden, differently, per instance</H2>
      <Flex direction="col" align="center" justify="between" gap="sm">
        <Button
          variant="solid"
          color="danger"
          size="lg"
          radius="full"
          animation="lift">
          Delete account
        </Button>
        <Button variant="ghost" color="warning" size="sm">
          Dismiss
        </Button>
        <Button
          icon
          aria-label="Confirm"
          variant="solid"
          color="success"
          isLoading>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </Button>
      </Flex>

      <H2>Form fields — overridden sizing, alignment, and status</H2>
      <Flex direction="col">
        <Input
          label="Email"
          labelAlign="left"
          size="sm"
          radius="xs"
          animation="scale"
          status="error"
          message="This email is already registered."
          isLoading={checking}
          onFocus={() => setChecking(true)}
          onBlur={() => setChecking(false)}
        />
        <TextArea
          label="Notes"
          labelAlign="right"
          size="lg"
          rows={2}
          status="success"
          message="Looks good."
        />
      </Flex>

      <H2>Grid — 2 columns instead of 4, tight gap</H2>
      <Grid columns={2} gap="xs">
        <P>One</P>
        <P>Two</P>
        <P>Three</P>
        <P>Four</P>
      </Grid>

      <H2>Scrollable — fully custom local scrollbar</H2>
      <Container
        scrollable
        scrollbar={{
          thumb: "#22d3ee",
          track: "#0f172a",
          width: "10px",
          radius: "2px",
        }}
        className="h-32">
        <P>
          This scrollbar is cyan and thick — thumb/track/width/radius all
          overridden right here, not in config.
        </P>
        <P>Line two padding the height.</P>
        <P>Line three padding the height.</P>
        <P>Line four padding the height.</P>
      </Container>

      <H2>Standalone spinner — fast and red</H2>
      <Spinner size="lg" color="danger" speed="0.3s" />
    </Container>
  );
}
