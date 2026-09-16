# Layouts

AsheeUI builds a page in layers, and each layer composes the one below it:

```text
primitive   Button, Input, Typography
     ↓
component   Modal, Tabs, Dropmenu
     ↓
pattern     EmptyState, Card, DataTable
     ↓
layout      Container, Section, Stack, Grid, Centered, Split, Page
     ↓
composition MarketingLayout, DocsLayout, SidebarLayout, AuthLayout
     ↓
page        the sections a page is made of
```

You can stop at any layer. A settings screen is a `Split` with two cards; a
dashboard is `SidebarLayout` with `PageContent`; a landing page is
`MarketingLayout` with five sections. Nothing in a lower layer knows about a
higher one, which is what keeps a component usable on its own.

## The layout primitives

| Primitive | What it decides | What it deliberately does not do |
| --- | --- | --- |
| `Container` | Maximum width, a responsive gutter, horizontal centring | No background, no vertical rhythm |
| `Section` | Vertical rhythm and a background band | No width, no colour other than its own background |
| `Stack` (`HStack`, `VStack`) | One axis, a token gap, alignment and distribution | No wrapping rules beyond `wrap`, no sizing |
| `Grid` | A column count per breakpoint, a gap, cell alignment | No ordering, no spans, no masonry |
| `Centered` | One block in the middle, on the axis you choose | No width of its own unless you ask for a container |
| `Split` | Two panes, the breakpoint they stack at, the ratio between them | No hidden panes, no routing, no state |
| `Page`, `PageHeader`, `PageContent`, `PageFooter` | A full-height application shell and its parts | No navigation, no data |

Every one of them resolves its options through the standard configuration
cascade, so a whole application can restate its rhythm once:

```tsx
<AsheeUIProvider
  config={{
    components: {
      container: { size: "xl", gutter: true },
      stack: { gap: "lg" },
      grid: { columns: 1, columnsMd: 2, columnsLg: 3 },
      section: { spacing: "xl" },
      split: { stackAt: "lg", ratio: "start" },
    },
  }}>
  <App />
</AsheeUIProvider>
```

## Responsiveness

Responsiveness is a property of the component's purpose rather than a house
breakpoint. Three rules cover the layout layer:

1. **A grid states its column count per breakpoint.** `columns={1} columnsMd={2}
   columnsLg={3}` is one column on a phone, two on a tablet and three on a
   laptop. A count left undefined inherits the value of the next smaller
   breakpoint, so a grid that never changes shape only states `columns`.
2. **A split states where it stops stacking.** `stackAt="lg"` is a column on a
   narrow screen and two panes from 1024 pixels. Nothing is hidden: the panes
   stack, so the reading order and the tab order stay the order you wrote them.
3. **A container and a section vary their own gutter and rhythm.** `Container`
   widens its gutter with the viewport and `Section` widens its padding, so a
   page reads as a page on a phone and as a band on a wide screen without a media
   query at each use.

The breakpoints are `sm` 640, `md` 768, `lg` 1024 and `xl` 1280, and they are the
same values in `@asheeui/shared`, so a native layout that says `md` means the
same width.

## Compositions

### A marketing page

```tsx
<MarketingLayout
  navigation={<Navbar brand="Ashee" links={links} actions={actions} />}
  footer={<Footer brand="Ashee" groups={groups} copyright="Ashee Softworks" />}>
  <Hero
    eyebrow="AsheeUI 2.0"
    title="A complete UI system"
    primaryAction={{ label: "Start free", href: "/signup" }}
  />
  <FeatureGrid title="Everything a page needs" features={features} />
  <CTA title="Start building" primaryAction={{ label: "Read the docs", href: "/docs" }} />
</MarketingLayout>
```

`MarketingLayout` supplies the page background, the `main` landmark and a skip
link, and paints nothing else. Which sections exist, in what order, and whether
they appear at all stay yours, because they are children.

### A documentation page

```tsx
<DocsLayout
  header={<Navbar brand="AsheeUI" links={links} />}
  navigation={<Sidebar items={sections} activeKey="layout" />}
  toc={<TableOfContents items={headings} />}>
  <Typography role="display">Layouts</Typography>
  <Typography role="body-md">A page is composed from the layout layer.</Typography>
</DocsLayout>
```

The contents take the third column from the `xl` breakpoint and are hidden below
it, because they repeat the article's own headings, which stay in the article.
The navigation column stacks above the article on a narrow screen rather than
hiding behind a drawer, so nothing has to be opened to be reached.

### A dashboard

```tsx
<SidebarLayout
  header={<Navbar brand="Ashee SMS" links={links} />}
  sidebar={<Sidebar items={navigation} activeKey="campaigns" />}>
  <PageHeader sticky>
    <Typography role="heading-lg">Campaigns</Typography>
  </PageHeader>
  <PageContent spacing="lg">
    <Grid columns={1} columnsMd={2} columnsLg={4} gap="lg">
      <Card title="Sent" description="348 this month" />
      <Card title="Delivered" description="99.2 percent" />
    </Grid>
    <DataTable data={campaigns} columns={columns} searchAccessor={byName} />
  </PageContent>
  <PageFooter>
    <Typography role="caption" tone="muted">Version 2.0.0</Typography>
  </PageFooter>
</SidebarLayout>
```

There is no separate dashboard layout: the shell, the page parts and the
components are the dashboard, and every one of them is also usable somewhere
else.

### A sign-in page

```tsx
<AuthLayout brand="Ashee" title="Sign in" description="Welcome back.">
  <Form onSubmit={signIn}>
    <VStack gap="md">
      <Input label="Email" type="email" required />
      <PasswordInput label="Password" required />
      <Button type="submit" fullWidth>Sign in</Button>
    </VStack>
  </Form>
</AuthLayout>
```

## Accessibility

The layout layer carries the structure a screen reader needs, so a page does not
have to invent it:

- `MarketingLayout` and `DocsLayout` render the `main` landmark, keep the skip
  link as the first focusable element, and make the region the link points at
  focusable, so following the link moves the reader into the content.
- `SidebarLayout` renders its navigation column as a named `complementary`
  landmark, and both compositions name theirs.
- A grid renders `ul` with `li` cells when it is a list, and a stack does the
  same, because a grid of cards is a list of cards.
- A split never removes a pane from the document, so the tab order stays the
  written order at every width.
- `Stepper` marks the current step with `aria-current="step"` and states each
  step's condition in words, so the sequence does not depend on colour.

## On native

The portable half of the layout layer exists on both platforms: `Container`,
`Section`, `Stack`/`HStack`/`VStack`, `Grid` and `Centered` are implemented in
`@asheeui/native` with the same props and the same cascade. `Split`, `Page` and
the four compositions are not ported as components, because a native screen
composes differently: it is a scroll view with a header and a stack, and the
platform supplies split views and navigation itself. The compatibility matrix in
`@asheeui/shared` records what each component means on each platform. See
[React Native](./native.md) for the details.

---

Built with AI. See [Ashee Softworks](https://asheesoftworks.com).
