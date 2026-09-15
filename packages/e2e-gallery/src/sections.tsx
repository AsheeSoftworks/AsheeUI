/**
 * The gallery that every playground application renders.
 *
 * The gallery is deliberately one file: a section holds its markup, the contract
 * that markup must satisfy, and the interaction it supports, so a component's
 * consumer-facing behaviour is described once and checked by all three
 * playgrounds. Each playground contributes only what makes it that framework: its
 * router, its link and image components, its server renderer and its entry point.
 *
 * The sections cover the newest additions first, because they are the components
 * whose consumer integration is least proven, followed by the established
 * components that exercise the configuration, theme and layout layers. Components
 * that exist only to serve another component (`field`, `menu`) are absent on
 * purpose: they are not part of the public surface.
 *
 * Framework substitution flows in from the playground through
 * {@link GallerySectionProps}, which is how a Next.js `Link` or a TanStack Router
 * `Link` reaches the components that render links.
 */

"use client";

import type { ColumnDef } from "asheeui";
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Chip,
  Container,
  DataTable,
  EmptyState,
  ErrorState,
  Form,
  Grid,
  HStack,
  Input,
  Link,
  LoadingState,
  Modal,
  Navbar,
  Pagination,
  SearchInput,
  Section,
  Skeleton,
  Spinner,
  Stepper,
  Switch,
  Tabs,
  Tooltip,
  Typography,
  VStack,
} from "asheeui";
import { useState } from "react";
import {
  accessibleNameOf,
  createSectionReport,
  requireAbsent,
  requireAnyText,
  requireAttribute,
  requireElement,
  requireName,
  requireOwnText,
  requireText,
  textOf,
} from "./dom";
import { click, focus, press, typeInto, waitFor } from "./events";
import type { GallerySection, GallerySectionProps } from "./types";

/**
 * Typography, weights and semantic levels.
 */
function TypographySection() {
  return (
    <VStack gap="sm">
      <VStack gap="none" data-check="heading">
        <Typography role="heading-lg">Invoice overview</Typography>
      </VStack>
      <VStack gap="sm" data-check="summary">
        <Typography role="body-md">
          Six invoices are awaiting payment this month.
        </Typography>
        <Typography role="body-sm">Updated four minutes ago</Typography>
      </VStack>
    </VStack>
  );
}

/** Button variants and its busy, disabled and destructive states. */
function ButtonSection() {
  return (
    <HStack gap="md" wrap>
      <Button>Save invoice</Button>
      <Button variant="bordered" color="danger">
        Delete
      </Button>
      <Button isLoading>Syncing</Button>
      <Button isDisabled>Unavailable</Button>
    </HStack>
  );
}

/** Badge colours and its icon-only labelling contract. */
function BadgeSection() {
  return (
    <HStack gap="sm" wrap>
      <Badge color="success">Paid</Badge>
      <Badge color="danger" variant="faded">
        Overdue
      </Badge>
      <Badge
        color="primary"
        label="Three unread"
        startContent={
          <Typography as="span" role="label" aria-hidden="true">
            3
          </Typography>
        }
      />
    </HStack>
  );
}

/** Chip, including the remove control. */
function ChipSection() {
  return (
    <HStack gap="sm" wrap>
      <Chip dot>finance</Chip>
      <Chip onClose={() => {}}>draft</Chip>
    </HStack>
  );
}

/** The field and control primitives, with their labels and descriptions. */
function FieldSection() {
  return (
    <VStack gap="md">
      <VStack gap="none" data-check="input">
        <Input label="Reference" description="Printed on the invoice" />
      </VStack>
      <VStack gap="none" data-check="switch">
        <Switch
          label="Send a reminder"
          description="Emails the customer when payment is due"
          defaultChecked
        />
      </VStack>
    </VStack>
  );
}

/** Skeleton in its decorative and labelled busy forms. */
function SkeletonSection() {
  return (
    <VStack gap="sm">
      {/* The placeholder's dimensions are the skeleton's only size axis, and the
          library exposes no token for it yet, so the shared application sizes it
          through the element's own `style` rather than through a utility class.
          A sizing token is recorded as the deferral that removes this. */}
      <Skeleton style={{ height: "1rem", width: "10rem" }} />
      <Skeleton isBusy label="Loading invoices" />
    </VStack>
  );
}

/** Alert by urgency, including the dismiss control. */
function AlertSection() {
  return (
    <VStack gap="md">
      <Alert type="error" title="Payment failed">
        The card was declined.
      </Alert>
      <Alert type="info" title="Update">
        A new version is available.
      </Alert>
      <Alert
        type="warning"
        title="Overdue"
        isClosable
        onClose={() => {}}
        closeLabel="Dismiss the overdue notice">
        Send a reminder to the customer.
      </Alert>
    </VStack>
  );
}

/** Avatar initials, its picture and its unnamed form. */
function AvatarSection({ imageComponent, imageProps }: GallerySectionProps) {
  return (
    <HStack gap="md" wrap data-check="avatars">
      <VStack gap="none" data-check="initials">
        <Avatar name="Ada Lovelace" />
      </VStack>
      <VStack gap="none" data-check="picture">
        <Avatar
          name="Grace Hopper"
          src="/avatars/grace.png"
          component={imageComponent}
          componentProps={imageProps}
        />
      </VStack>
      <VStack gap="none" data-check="unnamed">
        <Avatar src="/avatars/unnamed.png" />
      </VStack>
    </HStack>
  );
}

/** Link, in its internal and external forms. */
function LinkSection({ linkComponent, linkProps }: GallerySectionProps) {
  return (
    <HStack gap="lg" wrap>
      <Link
        href="/invoices"
        component={linkComponent}
        componentProps={linkProps}>
        All invoices
      </Link>
      <Link href="https://asheeui.com" isExternal>
        Documentation
      </Link>
    </HStack>
  );
}

/** Breadcrumb, with its linked steps and its current location. */
function BreadcrumbSection({ linkComponent, linkProps }: GallerySectionProps) {
  return (
    <Breadcrumb
      items={[
        {
          id: "invoices",
          label: "Invoices",
          href: "/invoices",
          component: linkComponent,
          componentProps: linkProps,
        },
        {
          id: "month",
          label: "March",
          href: "/invoices/2026-03",
          component: linkComponent,
          componentProps: linkProps,
        },
        { id: "current", label: "INV-0042" },
      ]}
    />
  );
}

/** Form, keeping the native submission contract and the field group. */
function FormSection() {
  return (
    <Form
      legend="Record a payment"
      action="/invoices/INV-0042/payments"
      method="post"
      submitLabel="Record payment"
      onSubmit={(event) => event.preventDefault()}>
      <Input label="Amount" name="amount" />
    </Form>
  );
}

/** Spinner, which is decorative by design. */
function SpinnerSection() {
  return (
    <VStack gap="none" data-check="spinner">
      <Spinner />
    </VStack>
  );
}

/** Pagination in its interactive and linked forms. */
function PaginationSection() {
  const [page, setPage] = useState(2);

  return (
    <VStack gap="lg">
      <VStack gap="none" data-check="interactive">
        <Pagination page={page} pageCount={4} onPageChange={setPage} />
      </VStack>
      <VStack gap="none" data-check="linked">
        <Pagination
          page={1}
          pageCount={3}
          hrefForPage={(target) => `/invoices?page=${target}`}
        />
      </VStack>
    </VStack>
  );
}

/** Tabs, which report the selected tab and swap the panel. */
function TabsSection() {
  const [activeId, setActiveId] = useState<string | number>("all");

  return (
    <Tabs
      tabs={[
        {
          id: "all",
          label: "All",
          content: (
            <Typography role="body-md">Three invoices in total.</Typography>
          ),
        },
        {
          id: "overdue",
          label: "Overdue",
          content: (
            <Typography role="body-md">One invoice is overdue.</Typography>
          ),
        },
      ]}
      activeId={activeId}
      onChange={setActiveId}
    />
  );
}

/** Accordion, which reports the open item. */
function AccordionSection() {
  return (
    <Accordion
      items={[
        {
          id: "terms",
          title: "Terms",
          content: (
            <Typography role="body-md">Payment is due in 30 days.</Typography>
          ),
        },
        {
          id: "notes",
          title: "Notes",
          content: <Typography role="body-md">Approved by finance.</Typography>,
        },
      ]}
      defaultValue="terms"
    />
  );
}

/** Modal, which the consumer opens and closes. */
function ModalSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open the payment dialog</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        aria-label="Record a payment">
        <Typography role="body-md">Paid today by card.</Typography>
      </Modal>
    </>
  );
}

/** Tooltip, which opens on focus. */
function TooltipSection() {
  return (
    <Tooltip content="Copies the invoice reference" delay={0}>
      <Button variant="ghost">Copy the reference</Button>
    </Tooltip>
  );
}

/**
 * Every section of the gallery, with the contract its markup must satisfy
 * wherever it renders.
 *
 * Each contract is checked against the playground's server markup and against
 * the same tree after hydration, so a section that only becomes correct in a
 * browser fails the playground's end-to-end test.
 */
/**
 * The layout layer and the page sections it carries.
 *
 * The section renders the composition the framework is for: a band whose rhythm
 * and width come from the layout components, a card deck whose column count
 * changes at a breakpoint, an empty state, and a navigation bar whose mobile
 * panel is a disclosure. Nothing here is styled by hand.
 */
function LayoutSection({ linkComponent, linkProps }: GallerySectionProps) {
  return (
    <VStack gap="2xl">
      <Navbar
        brand="Ashee SMS"
        brandHref="/"
        align="center"
        link={{ component: linkComponent, props: linkProps }}
        links={[
          { label: "Campaigns", href: "/campaigns", isActive: true },
          { label: "Contacts", href: "/contacts" },
        ]}
        mobileLabel="Open the playground navigation"
      />

      <Section spacing="sm" as="div" background="muted">
        <Container size="md">
          <VStack gap="lg">
            <HStack justify="between" align="center">
              <Typography role="heading-md" data-check="band-heading">
                Layout showcase
              </Typography>
              <Badge color="success">Covered</Badge>
            </HStack>

            <Grid columns={1} columnsMd={2} gap="sm" data-check="deck">
              <Card title="Sent" description="348 this month" />
              <Card title="Drafts" description="3 unfinished" />
            </Grid>
          </VStack>
        </Container>
      </Section>

      <EmptyState
        title="No campaigns match that filter"
        description="Try a different name."
        panel
        data-check="empty-state"
      />
    </VStack>
  );
}

/** The search field: a named region, a reported query and a clear control. */
function SearchInputSection() {
  const [query, setQuery] = useState("");

  return (
    <VStack gap="sm" data-check="search">
      <SearchInput
        label="Search invoices"
        placeholder="Search invoices"
        shortcut="Cmd K"
        onValueChange={setQuery}
      />
      <Typography data-check="query" role="body-sm" tone="muted">
        {query ? `Query: ${query}` : "No query yet"}
      </Typography>
    </VStack>
  );
}

/** The reader's progress through a sequence of steps. */
function StepperSection() {
  const [step, setStep] = useState(1);

  return (
    <VStack gap="none" data-check="stepper">
      <Stepper
        label="Checkout"
        currentStep={step}
        onStepChange={setStep}
        steps={[
          { key: "cart", label: "Cart" },
          { key: "address", label: "Address", description: "Where it ships" },
          { key: "payment", label: "Payment" },
        ]}
      />
    </VStack>
  );
}

/** The loading, failed and retried presentations of one region. */
function StateSection() {
  const [attempts, setAttempts] = useState(0);

  return (
    <VStack gap="lg">
      <LoadingState
        label="Loading invoices"
        description="This usually takes a moment."
        data-check="loading"
      />
      <ErrorState
        title="Invoices could not be loaded"
        description="The request timed out."
        detail="ECONNRESET at 10.0.0.4"
        onRetry={() => setAttempts((count) => count + 1)}
        data-check="error"
      />
      <Typography data-check="attempts" role="body-sm" tone="muted">
        {attempts === 0 ? "No retry yet" : `Retried ${attempts} time`}
      </Typography>
    </VStack>
  );
}

/** One invoice, as the table section sees it. */
interface GalleryInvoice {
  id: string;
  number: string;
  customer: string;
}

/** The rows the table section shows. */
const GALLERY_INVOICES: GalleryInvoice[] = [
  { id: "1", number: "INV-0001", customer: "Ashee" },
  { id: "2", number: "INV-0002", customer: "Northwind" },
  { id: "3", number: "INV-0003", customer: "Contoso" },
];

/** The columns the table section shows. */
const GALLERY_INVOICE_COLUMNS: ColumnDef<GalleryInvoice>[] = [
  { id: "number", header: "Number", cell: (row) => row.number },
  { id: "customer", header: "Customer", cell: (row) => row.customer },
];

/** The table a list page is built from: search, a count and paging. */
function DataTableSection() {
  return (
    <VStack gap="none" data-check="table">
      <DataTable
        title="Invoices"
        description="Everything issued this quarter."
        data={GALLERY_INVOICES}
        columns={GALLERY_INVOICE_COLUMNS}
        pageSize={2}
        searchAccessor={(row) => `${row.number} ${row.customer}`}
        rowKeyAccessor={(row) => row.id}
      />
    </VStack>
  );
}

export const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: "search-input",
    title: "Search field",
    Component: SearchInputSection,
    isInteractive: true,
    interaction: {
      description:
        "reports the query and empties the field through its control",
      run: async (container) => {
        const problems: string[] = [];
        const scope = container.querySelector(
          '[data-gallery-section="search-input"]',
        );
        const field = scope?.querySelector<HTMLInputElement>(
          'input[type="search"]',
        );

        if (!scope || !field) {
          return ["search-input: no search field"];
        }

        await typeInto(field, "northwind");

        if (
          textOf(scope.querySelector('[data-check="query"]')) !==
          "Query: northwind"
        ) {
          problems.push("search-input: the typed query was not reported");
        }

        const clear = Array.from(scope.querySelectorAll("button")).find(
          (candidate) => accessibleNameOf(scope, candidate) === "Clear search",
        );

        if (!clear) {
          problems.push(
            "search-input: no clear control appeared for a field with text",
          );
          return problems;
        }

        await click(clear);

        if (field.value !== "") {
          problems.push("search-input: the clear control left text behind");
        }

        if (
          textOf(scope.querySelector('[data-check="query"]')) !== "No query yet"
        ) {
          problems.push("search-input: the emptied query was not reported");
        }

        return problems;
      },
    },
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "search-input");

      requireElement(report, scope, '[role="search"]', "the search landmark");
      requireName(
        report,
        scope,
        'input[type="search"]',
        "Search invoices",
        "the search field",
      );
      requireOwnText(
        report,
        scope,
        "No query yet",
        "the field's initial report",
      );

      return report.problems;
    },
  },
  {
    id: "stepper",
    title: "Stepper",
    Component: StepperSection,
    isInteractive: true,
    interaction: {
      description: "makes the step a reader chooses the current one",
      run: async (container) => {
        const problems: string[] = [];
        const scope = container.querySelector(
          '[data-gallery-section="stepper"]',
        );

        if (!scope) {
          return ["stepper: no stepper"];
        }

        const payment = Array.from(scope.querySelectorAll("button")).find(
          (candidate) => textOf(candidate).includes("Payment"),
        );

        if (!payment) {
          problems.push(
            "stepper: the step a reader has not reached is not a control",
          );
          return problems;
        }

        await click(payment);

        const current = scope.querySelector('[aria-current="step"]');

        if (!textOf(current).includes("Payment")) {
          problems.push("stepper: the chosen step did not become current");
        }

        return problems;
      },
    },
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "stepper");

      requireElement(
        report,
        scope,
        'ol[aria-label="Checkout"]',
        "the ordered list of steps",
      );
      requireAttribute(
        report,
        scope,
        '[aria-current="step"]',
        "aria-current",
        "step",
        "the current step",
      );
      requireText(
        report,
        scope,
        '[data-check="stepper"]',
        "Completed:",
        "the completed step's state in words",
      );
      requireText(
        report,
        scope,
        '[data-check="stepper"]',
        "Not started:",
        "an upcoming step's state in words",
      );

      return report.problems;
    },
  },
  {
    id: "states",
    title: "Loading and failed states",
    Component: StateSection,
    isInteractive: true,
    interaction: {
      description: "runs the retry a failed region offers",
      run: async (container) => {
        const problems: string[] = [];
        const scope = container.querySelector(
          '[data-gallery-section="states"]',
        );
        const retry = Array.from(scope?.querySelectorAll("button") ?? []).find(
          (candidate) => textOf(candidate) === "Try again",
        );

        if (!scope || !retry) {
          return ["states: no retry control"];
        }

        await click(retry);

        if (
          !textOf(scope.querySelector('[data-check="attempts"]')).startsWith(
            "Retried",
          )
        ) {
          problems.push("states: the retry control did not run the handler");
        }

        return problems;
      },
    },
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "states");

      requireAttribute(
        report,
        scope,
        '[data-check="loading"]',
        "role",
        "status",
        "the loading region, announced as a status",
      );
      requireText(
        report,
        scope,
        '[data-check="loading"]',
        "Loading invoices",
        "the loading label",
      );
      requireAttribute(
        report,
        scope,
        '[data-check="error"]',
        "role",
        "alert",
        "the failed region, announced as an alert",
      );
      requireText(
        report,
        scope,
        '[data-check="error"]',
        "Invoices could not be loaded",
        "the failure heading",
      );
      requireText(
        report,
        scope,
        '[data-check="error"]',
        "Technical details",
        "the disclosure of the technical message",
      );

      return report.problems;
    },
  },
  {
    id: "data-table",
    title: "Table with search and paging",
    Component: DataTableSection,
    isInteractive: true,
    interaction: {
      description: "filters the rows and reports how many are left",
      run: async (container) => {
        const problems: string[] = [];
        const scope = container.querySelector(
          '[data-gallery-section="data-table"]',
        );
        const field = scope?.querySelector<HTMLInputElement>(
          'input[type="search"]',
        );
        const count = () =>
          textOf(scope?.querySelector('[role="status"]') ?? null);

        if (!scope || !field) {
          return ["data-table: no search field"];
        }

        await typeInto(field, "contoso");

        if (!count().includes("Showing 1 to 1 of 1")) {
          problems.push(
            `data-table: the row count reads "${count()}" after a search`,
          );
        }

        if (
          scope
            .querySelector('[data-check="table"] tbody')
            ?.textContent?.includes("INV-0001")
        ) {
          problems.push("data-table: the filtered-out row is still shown");
        }

        return problems;
      },
    },
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "data-table");

      requireElement(report, scope, "table", "the table");
      requireText(
        report,
        scope,
        '[data-check="table"]',
        "Number",
        "the first column heading",
      );
      requireText(
        report,
        scope,
        '[data-check="table"]',
        "INV-0001",
        "the first row",
      );
      requireText(
        report,
        scope,
        '[role="status"]',
        "Showing 1 to 2 of 3",
        "the row count, which reports the page and the total",
      );

      return report.problems;
    },
  },
  {
    id: "typography",
    title: "Typography",
    Component: TypographySection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "typography");

      requireText(
        report,
        scope,
        '[data-check="heading"] h2',
        "Invoice overview",
        "the section heading",
      );
      requireText(
        report,
        scope,
        '[data-check="summary"]',
        "Six invoices are awaiting payment",
        "the summary",
      );
      requireText(
        report,
        scope,
        '[data-check="summary"]',
        "Updated four minutes ago",
        "the timestamp",
      );

      return report.problems;
    },
  },
  {
    id: "buttons",
    title: "Buttons",
    Component: ButtonSection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "buttons");

      requireAnyText(
        report,
        scope,
        "button",
        "Save invoice",
        "the primary action",
      );
      requireAnyText(
        report,
        scope,
        "button",
        "Delete",
        "the destructive action",
      );
      requireAnyText(
        report,
        scope,
        'button[aria-busy="true"]',
        "Syncing",
        "the busy control's label",
      );
      requireElement(report, scope, "button[disabled]", "a disabled control");

      return report.problems;
    },
  },
  {
    id: "badges",
    title: "Badges",
    Component: BadgeSection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "badges");

      requireAnyText(report, scope, "span", "Paid", "the status badge");
      requireAnyText(report, scope, "span", "Overdue", "the warning badge");
      requireText(
        report,
        scope,
        ".sr-only",
        "Three unread",
        "the icon-only badge's label",
      );

      return report.problems;
    },
  },
  {
    id: "chips",
    title: "Chips",
    Component: ChipSection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "chips");

      requireOwnText(report, scope, "finance", "the category chip");
      requireOwnText(report, scope, "draft", "the removable chip");
      requireName(
        report,
        scope,
        "button",
        "Remove",
        "the chip's remove control",
      );

      return report.problems;
    },
  },
  {
    id: "fields",
    title: "Fields and controls",
    Component: FieldSection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "fields");

      requireName(
        report,
        scope,
        '[data-check="input"] input',
        "Reference",
        "the reference field",
      );
      requireText(
        report,
        scope,
        '[data-check="input"]',
        "Printed on the invoice",
        "the field description",
      );
      requireName(
        report,
        scope,
        '[data-check="switch"] [role="switch"]',
        "Send a reminder",
        "the switch control",
      );
      requireText(
        report,
        scope,
        '[data-check="switch"]',
        "Emails the customer when payment is due",
        "the switch description",
      );

      return report.problems;
    },
  },
  {
    id: "skeletons",
    title: "Loading placeholders",
    Component: SkeletonSection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "skeletons");

      requireAttribute(
        report,
        scope,
        '[aria-hidden="true"]',
        "aria-hidden",
        "true",
        "the decorative placeholder",
      );
      requireText(
        report,
        scope,
        '[role="status"]',
        "Loading invoices",
        "the labelled loading status",
      );
      requireAttribute(
        report,
        scope,
        '[role="status"]',
        "aria-busy",
        "true",
        "the labelled loading status",
      );

      return report.problems;
    },
  },
  {
    id: "alerts",
    title: "Alerts",
    Component: AlertSection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "alerts");

      requireText(
        report,
        scope,
        '[role="alert"]',
        "Payment failed",
        "the urgent message",
      );
      requireText(
        report,
        scope,
        '[role="status"]',
        "A new version is available",
        "the informational message",
      );
      requireName(
        report,
        scope,
        "button",
        "Dismiss the overdue notice",
        "the dismiss control",
      );

      return report.problems;
    },
  },
  {
    id: "avatars",
    title: "Avatars",
    Component: AvatarSection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "avatars");

      requireName(
        report,
        scope,
        '[data-check="initials"] [role="img"]',
        "Ada Lovelace",
        "the initials avatar",
      );
      requireText(
        report,
        scope,
        '[data-check="initials"]',
        "AL",
        "the initials fallback",
      );
      requireName(
        report,
        scope,
        '[data-check="picture"] [role="img"]',
        "Grace Hopper",
        "the picture avatar",
      );
      requireAttribute(
        report,
        scope,
        '[data-check="picture"] img',
        "alt",
        "",
        "the decorative picture",
      );
      requireAttribute(
        report,
        scope,
        '[data-check="unnamed"] [aria-hidden="true"]',
        "aria-hidden",
        "true",
        "the unnamed avatar",
      );

      return report.problems;
    },
  },
  {
    id: "links",
    title: "Links",
    Component: LinkSection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "links");

      requireAnyText(report, scope, "a", "All invoices", "the internal link");
      requireElement(
        report,
        scope,
        'a[href="/invoices"]',
        "the internal link's destination",
      );
      requireElement(
        report,
        scope,
        'a[href="https://asheeui.com"]',
        "the external link's destination",
      );

      return report.problems;
    },
  },
  {
    id: "breadcrumb",
    title: "Breadcrumb",
    Component: BreadcrumbSection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "breadcrumb");

      requireElement(
        report,
        scope,
        'nav[aria-label="Breadcrumb"]',
        "the breadcrumb landmark",
      );
      requireElement(
        report,
        scope,
        'a[href="/invoices/2026-03"]',
        "a link to the month",
      );
      requireText(
        report,
        scope,
        '[aria-current="page"]',
        "INV-0042",
        "the current location",
      );
      requireElement(
        report,
        scope,
        '[aria-hidden="true"]',
        "a separator that is hidden from assistive technology",
      );

      return report.problems;
    },
  },
  {
    id: "pagination",
    title: "Pagination",
    Component: PaginationSection,
    interaction: {
      description: "moves to another page when its control is clicked",
      run: async (container) => {
        const problems: string[] = [];
        const scope = container.querySelector('[data-check="interactive"]');
        const control = scope?.querySelector('button[aria-label="Page 4"]');

        if (!scope || !control) {
          return ["pagination: no control for page 4"];
        }

        await click(control);

        const current = textOf(scope.querySelector('[aria-current="page"]'));

        if (current !== "4") {
          problems.push(
            `pagination: expected page 4 to be current, found "${current}"`,
          );
        }

        return problems;
      },
    },
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "pagination");

      requireElement(
        report,
        scope,
        'nav[aria-label="Pagination"]',
        "the pagination landmark",
      );
      requireText(
        report,
        scope,
        '[data-check="interactive"] [aria-current="page"]',
        "2",
        "the current page",
      );
      requireElement(
        report,
        scope,
        '[data-check="interactive"] button[aria-label="Next page"]',
        "the control for the next page",
      );
      requireElement(
        report,
        scope,
        '[data-check="linked"] a[href="/invoices?page=3"]',
        "the link to the third page",
      );
      requireElement(
        report,
        scope,
        '[data-check="linked"] a[aria-disabled="true"]',
        "an unavailable control at the first page",
      );

      return report.problems;
    },
  },
  {
    id: "form",
    title: "Form",
    Component: FormSection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "form");

      requireAttribute(
        report,
        scope,
        "form",
        "action",
        "/invoices/INV-0042/payments",
        "the form's submission target",
      );
      requireAttribute(
        report,
        scope,
        "form",
        "method",
        "post",
        "the form's method",
      );
      requireText(
        report,
        scope,
        "legend",
        "Record a payment",
        "the field group legend",
      );
      requireName(
        report,
        scope,
        'input[name="amount"]',
        "Amount",
        "the amount field",
      );
      requireAnyText(
        report,
        scope,
        'button[type="submit"]',
        "Record payment",
        "the submit control",
      );

      return report.problems;
    },
  },
  {
    id: "spinner",
    title: "Spinner",
    Component: SpinnerSection,
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "spinner");

      requireAttribute(
        report,
        scope,
        "svg",
        "aria-hidden",
        "true",
        "the decorative spinner glyph",
      );

      return report.problems;
    },
  },
  {
    id: "tabs",
    title: "Tabs",
    Component: TabsSection,
    interaction: {
      description: "swaps the panel when another tab is selected",
      run: async (container) => {
        const problems: string[] = [];
        const scope = container.querySelector('[data-gallery-section="tabs"]');
        const tab = Array.from(
          scope?.querySelectorAll('[role="tab"]') ?? [],
        ).find((candidate) => textOf(candidate) === "Overdue");

        if (!scope || !tab) {
          return ["tabs: no tab labelled Overdue"];
        }

        await click(tab);

        if (!textOf(scope).includes("One invoice is overdue.")) {
          problems.push(
            "tabs: the panel did not change to the overdue invoice",
          );
        }

        if (tab.getAttribute("aria-selected") !== "true") {
          problems.push(
            `tabs: the selected tab reports aria-selected="${tab.getAttribute("aria-selected")}"`,
          );
        }

        return problems;
      },
    },
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "tabs");

      requireElement(report, scope, '[role="tablist"]', "the tab list");
      requireText(
        report,
        scope,
        '[role="tab"][aria-selected="true"]',
        "All",
        "the selected tab",
      );
      requireText(
        report,
        scope,
        '[role="tabpanel"]',
        "Three invoices in total.",
        "the visible panel",
      );

      return report.problems;
    },
  },
  {
    id: "accordion",
    title: "Accordion",
    Component: AccordionSection,
    interaction: {
      description: "opens another item when its trigger is clicked",
      run: async (container) => {
        const problems: string[] = [];
        const scope = container.querySelector(
          '[data-gallery-section="accordion"]',
        );
        const trigger = Array.from(
          scope?.querySelectorAll("button") ?? [],
        ).find((candidate) => textOf(candidate) === "Notes");

        if (!scope || !trigger) {
          return ["accordion: no trigger labelled Notes"];
        }

        await click(trigger);

        if (trigger.getAttribute("aria-expanded") !== "true") {
          problems.push(
            `accordion: the opened item reports aria-expanded="${trigger.getAttribute("aria-expanded")}"`,
          );
        }

        if (!textOf(scope).includes("Approved by finance.")) {
          problems.push("accordion: the opened item's content is missing");
        }

        return problems;
      },
    },
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "accordion");

      requireText(
        report,
        scope,
        '[aria-expanded="true"]',
        "Terms",
        "the open item",
      );
      requireOwnText(
        report,
        scope,
        "Payment is due in 30 days.",
        "the open item's content",
      );

      return report.problems;
    },
  },
  {
    id: "modal",
    title: "Modal",
    Component: ModalSection,
    isInteractive: true,
    interaction: {
      description: "opens a named dialog when its trigger is clicked",
      run: async (container) => {
        const problems: string[] = [];
        const trigger = container.querySelector(
          '[data-gallery-section="modal"] button',
        );

        if (!trigger) return ["modal: no trigger control"];

        await click(trigger);

        // The dialog is portalled, so it lands beside the container rather than
        // inside it, which is the point of the check.
        const dialog = await waitFor(
          () => document.querySelector('[role="dialog"]'),
          "the dialog to open",
        );

        if (typeof dialog === "string") {
          problems.push(`modal: ${dialog}`);
          return problems;
        }

        if (!dialog.getAttribute("aria-label")?.includes("Record a payment")) {
          problems.push(
            `modal: the dialog is named "${dialog.getAttribute("aria-label")}"`,
          );
        }

        if (!dialog.closest("body")) {
          problems.push("modal: the dialog did not reach the document body");
        }

        if (dialog.getAttribute("aria-modal") !== "true") {
          problems.push(
            `modal: the dialog reports aria-modal="${dialog.getAttribute("aria-modal")}"`,
          );
        }

        // A dialog that is never dismissed would leave the rest of the page
        // inert for the interactions that follow, so the interaction closes it
        // and waits for it to leave the DOM, which happens once the exit
        // animation has finished.
        await press("Escape");

        const closed = await waitFor(
          () => (document.querySelector('[role="dialog"]') ? null : true),
          "the dialog to close after Escape",
        );

        if (typeof closed === "string") {
          problems.push(`modal: ${closed}`);
        }

        return problems;
      },
    },
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "modal");

      requireAnyText(
        report,
        scope,
        "button",
        "Open the payment dialog",
        "the dialog trigger",
      );
      requireAbsent(report, scope, '[role="dialog"]', "open dialog");

      return report.problems;
    },
  },
  {
    id: "tooltip",
    title: "Tooltip",
    Component: TooltipSection,
    isInteractive: true,
    interaction: {
      description: "reveals its content when the trigger is focused",
      run: async (container) => {
        const problems: string[] = [];
        const trigger = container.querySelector(
          '[data-gallery-section="tooltip"] button',
        );

        if (!trigger) return ["tooltip: no trigger control"];

        await focus(trigger);

        // The tooltip is exposed through the trigger's description: the trigger
        // gains `aria-describedby` pointing at the element holding the content.
        const described = await waitFor(() => {
          const id = trigger.getAttribute("aria-describedby");

          return id ? document.getElementById(id) : null;
        }, "the trigger to describe itself with the tooltip content");

        if (typeof described === "string") {
          problems.push(`tooltip: ${described}`);
          return problems;
        }

        if (!textOf(described).includes("Copies the invoice reference")) {
          problems.push(`tooltip: the content reads "${textOf(described)}"`);
        }

        return problems;
      },
    },
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "tooltip");

      requireAnyText(
        report,
        scope,
        "button",
        "Copy the reference",
        "the tooltip trigger",
      );

      return report.problems;
    },
  },
  {
    id: "layout",
    title: "Layout and page sections",
    Component: LayoutSection,
    isInteractive: true,
    interaction: {
      description: "opens the mobile navigation panel and reports its state",
      run: async (container) => {
        const problems: string[] = [];
        const toggle = container.querySelector<HTMLButtonElement>(
          '[data-gallery-section="layout"] button[aria-label="Open the playground navigation"]',
        );

        if (!toggle) return ["layout: no navigation toggle control"];

        if (toggle.getAttribute("aria-expanded") !== "false") {
          problems.push(
            `layout: the navigation toggle starts at aria-expanded="${toggle.getAttribute("aria-expanded")}"`,
          );
        }

        await click(toggle);

        const panelId = toggle.getAttribute("aria-controls");
        const panel = await waitFor(
          () =>
            panelId
              ? document.getElementById(panelId)
              : container.querySelector(
                  '[data-gallery-section="layout"] nav[aria-label="Main"] ~ nav',
                ),
          "the navigation panel to appear",
        );

        if (typeof panel === "string") {
          problems.push(`layout: ${panel}`);
          return problems;
        }

        if (toggle.getAttribute("aria-expanded") !== "true") {
          problems.push("layout: the toggle did not report the panel as open");
        }

        await click(toggle);

        if (toggle.getAttribute("aria-expanded") !== "false") {
          problems.push(
            "layout: the toggle did not report the panel as closed",
          );
        }

        return problems;
      },
    },
    inspect: (root) => {
      const { report, scope } = createSectionReport(root, "layout");

      // The layout components supply the width and the breakpoint, so the deck
      // is asserted through their classes rather than through styling.
      const container = requireElement(
        report,
        scope,
        ".max-w-4xl",
        "the container width from the layout layer",
      );

      if (container && !container.className.includes("mx-auto")) {
        report.problems.push("layout: the container is not centred");
      }

      const deck = requireElement(
        report,
        scope,
        '[data-check="deck"]',
        "the card deck",
      );

      if (deck && !deck.className.includes("md:grid-cols-2")) {
        report.problems.push(
          "layout: the deck does not state its column count for the md breakpoint",
        );
      }

      requireText(
        report,
        scope,
        '[data-check="deck"]',
        "Sent",
        "the card deck",
      );
      requireText(
        report,
        scope,
        '[data-check="deck"]',
        "Drafts",
        "the card deck",
      );
      requireText(
        report,
        scope,
        '[data-check="deck"]',
        "348 this month",
        "a card description",
      );
      requireText(
        report,
        scope,
        '[data-check="band-heading"]',
        "Layout showcase",
        "the band heading",
      );
      requireText(
        report,
        scope,
        '[data-check="empty-state"]',
        "No campaigns match that filter",
        "the empty state heading",
      );
      requireName(
        report,
        scope,
        'nav[aria-label="Main"]',
        "Main",
        "the navigation landmark",
      );
      requireAttribute(
        report,
        scope,
        'button[aria-label="Open the playground navigation"]',
        "aria-expanded",
        "false",
        "the navigation toggle, closed",
      );

      return report.problems;
    },
  },
];
