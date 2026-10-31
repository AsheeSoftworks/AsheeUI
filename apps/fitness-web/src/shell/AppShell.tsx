/**
 * The web application's chrome.
 *
 * The platform difference the two apps demonstrate lives here: the web puts the
 * navigation at the top in a `Navbar`, while the Expo app puts it at the bottom. Both
 * bars are built from the same umbrella package.
 */
import {
  Avatar,
  Badge,
  Button,
  HStack,
  Navbar,
  Page,
  PageContent,
  PageFooter,
  Typography,
  useTheme,
  type NavbarLinkItem,
} from "asheeui";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { destinations, type RouteKey } from "@asheeui/fitness-shared";

/** The path a destination resolves to in this app's router. */
export const ROUTE_PATHS: Record<RouteKey, string> = {
  dashboard: "/",
  workouts: "/workouts",
  nutrition: "/nutrition",
  progress: "/progress",
  studio: "/studio",
  settings: "/settings",
};

/**
 * The router link the framework's `Link` renders through.
 *
 * AsheeUI's `Link` passes `href` to a substituted component; TanStack Router names the
 * destination `to`. The adapter is the one line between the two conventions, and it is
 * what keeps client-side navigation while the visual is the framework's.
 */
const RouterLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }
>(function RouterLink({ href, ...rest }, ref) {
  return <Link ref={ref} to={(href ?? "/") as "/"} {...rest} />;
});

/** The top bar and page frame. */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { resolvedTheme, setTheme } = useTheme();

  const links: NavbarLinkItem[] = destinations.map((destination) => ({
    label: destination.label,
    href: ROUTE_PATHS[destination.key],
    isActive: pathname === ROUTE_PATHS[destination.key],
  }));

  return (
    <Page>
      <Navbar
        brand={
          <HStack gap="sm" align="center">
            <Avatar name="Pulse" size="sm" />
            <Typography role="heading-sm">Pulse</Typography>
            <Badge color="primary" variant="faded" size="sm">
              demo
            </Badge>
          </HStack>
        }
        brandHref="/"
        links={links}
        link={{ component: RouterLink }}
        position="sticky"
        contained
        actions={
          <HStack gap="sm" align="center">
            <Button
              size="sm"
              variant="ghost"
              onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? "Light" : "Dark"}
            </Button>
            <Button size="sm" onPress={() => window.location.assign("/workouts")}>
              Train
            </Button>
          </HStack>
        }
      />
      <PageContent contained spacing="lg">
        {children}
      </PageContent>
      <PageFooter contained divider>
        <HStack justify="between" align="center" gap="md" wrap>
          <Typography role="caption" tone="muted">
            Pulse — a fitness tracker built with AsheeUI on TanStack Start.
          </Typography>
          <HStack gap="sm">
            <Badge variant="bordered" size="sm">
              web
            </Badge>
            <Badge variant="bordered" size="sm">
              TanStack Start
            </Badge>
          </HStack>
        </HStack>
      </PageFooter>
    </Page>
  );
}
