import {
  Button,
  Container,
  Flex,
  Grid,
  H1,
  H2,
  H3,
  Input,
  P,
  Spinner,
  TextArea,
} from "@ashee/ui";
import { useState } from "react";

export function GlobalsPage() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <Container>
      <H1>Global Config Test</H1>
      <P>
        Every value below comes from ashee.config.ts — no component here passes
        size, color, variant, radius, animation, spacing, or labelAlign. If this
        page looks styled at all, config resolution works.
      </P>

      <H2>Buttons — all identical, all from config</H2>
      <Flex>
        <Button>Save changes</Button>
        <Button>Continue</Button>
        <Button icon radius="full" aria-label="Delete item">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
          </svg>
        </Button>
        <Button isLoading={submitting} onClick={() => setSubmitting((s) => !s)}>
          {submitting ? "Submitting" : "Toggle loading"}
        </Button>
      </Flex>

      <H2>Form fields</H2>
      <Flex direction="col">
        <Input
          label="Full name"
          description="As it appears on your ID"
          required
        />
        <TextArea label="Bio" description="A few sentences about yourself" />
      </Flex>

      <H2>Grid</H2>
      <Grid>
        <H3>Cell one</H3>
        <H3>Cell two</H3>
        <H3>Cell three</H3>
        <H3>Cell four</H3>
      </Grid>

      <H2>Scrollable region</H2>
      <Container scrollable className="h-32">
        <P>
          Scroll me — thumb/track colors come from the company-red theme,
          width/radius from theme.scrollbar.
        </P>
        <P>
          Line two padding the height so there is something to scroll through
          comfortably.
        </P>
        <P>
          Line three padding the height so there is something to scroll through
          comfortably.
        </P>
        <P>
          Line four padding the height so there is something to scroll through
          comfortably.
        </P>
      </Container>

      <H2>Standalone spinner</H2>
      <Spinner />

      <P size="lg">
        Grows from 1.125rem to 1.375rem crossing the md breakpoint.
      </P>
      <Button size="lg">Padding tightens on mobile, opens up at 768px+</Button>
    </Container>
  );
}
