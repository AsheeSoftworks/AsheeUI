# @asheeui/web

## 2.2.0

### Minor Changes

- ba4222d: Split the library into a platform-neutral core, a web renderer and a native renderer,
  behind one entry point that routes to the right one.
  
  - `@asheeui/core` is new: the platform-neutral layer, built by Vite, that both platforms consume. It holds the design language, the component contracts, the compatibility matrix, the component registry, the cascade, the configuration pipeline, and the class dictionaries each renderer compiles. It depends on no platform and imports no React runtime. It replaces `@asheeui/shared`, which was a source-only folder rather than a package a consumer could install.
  - `@asheeui/web` is the DOM renderer: the React components, the icons, the Puck integration and the theme binding that reads the document and browser storage.
  - `@asheeui/native` is the React Native renderer. It consumes `@asheeui/core` instead of `@asheeui/shared`, and it no longer defines its own Button class strings: both renderers' strings now live in core, side by side, so a change to the scale is one edit.
  - `@asheeui/ui` is the umbrella entry point over the two renderers, and it is a new name rather than the one the library published under: the unscoped `asheeui` package is superseded rather than kept, so the entry point a consumer installs is scoped like the rest of the family. Its `main` reaches `@asheeui/web`, and its `react-native` field — with the `react-native` condition of its exports map and the `.native.ts` sibling Metro resolves — reaches `@asheeui/native`. An import of `@asheeui/ui` therefore names a component once and works on both platforms, and a browser bundle never contains React Native.
  - `@asheeui/cli` follows the new package names in the imports it writes and in the theme checks it runs.
  
  Import specifiers change once: the umbrella import `asheeui` becomes `@asheeui/ui`, `asheeui/styles` becomes `@asheeui/web/styles` and `asheeui/puck` becomes `@asheeui/web/puck`. `@asheeui/shared` is gone; its contracts, tokens and helpers are in `@asheeui/core`, which both `@asheeui/ui` and `@asheeui/web` re-export.
  
  The CLI resolves project paths independently of the separator, so the config import
  it writes and the file paths in its reports are the same on Windows as they are on
  macOS and Linux.

### Patch Changes

- a12c250: Native gains the clipboard pair — `Clipboard` and `CopyButton` — and the contract the two
  read is stated once in `@asheeui/core`.
  
  - `@asheeui/native` keeps the pair's shape: `Clipboard` is a render function with a state
    (whether the text is on the clipboard, whether the last attempt failed, how to copy, how
    to clear) and `CopyButton` is the framework's control built on it, so a consumer with an
    icon in a row or a menu item uses the primitive and gets the same behaviour the button
    has. The copied state is a timer on both platforms, cleared on unmount, and nothing is
    written during a render.
  - What performs the write is what differs. The browser has a clipboard API with a
    selection fallback; the platform has its own module, which the package reads through a
    binding of its own (`writeToClipboard`) rather than reaching for a third-party clipboard
    package every consumer's bundle would pay for. A refused write rejects with the platform's
    own cause, which is what a consumer's `onError` receives.
  - The control's affordances are characters where the web's are drawings: the package ships
    no icon set, so the copy glyph and the framework's tick stand in for `CopyIcon` and
    `CheckIcon`, and a consumer who wants a drawing passes `copyIcon` or `copiedIcon`. The
    button's accessible name is its label rather than its label with a glyph in front of it,
    because a reader asked to press "Copy" should hear "Copy".
  - The result is announced the same way on both platforms: a status region beside the
    control repeats what the label now says, because a label change is not announced on
    either. The web hides that region with `sr-only`; the platform has no such utility, so the
    region is a pixel-sized transparent view — out of the way, still in the accessibility tree.
  - `@asheeui/core` gains the clipboard contract (`components.clipboard`) and the one module
    both renderers read for the status region each announces through, along with the
    characters the native control draws.
  - `@asheeui/web` points its pair at those shared modules and its own styles file is removed.
    The rendered markup and the public props are unchanged.
  - The parity queue drops from 13 to 12: 46 of the 58 components the matrix promises for
    native are implemented.
- 54d0ed8: Native gains the content blocks — `Avatar`, `Chip` and `Image` — and the three contracts
  those blocks read are stated once in `@asheeui/core`.
  
  - `@asheeui/native` renders an avatar as a surface holding the consumer's picture, falling
    back to the entity's initials from `getInitials` in `@asheeui/core`, and announces one
    name through one image role rather than the initials and the picture separately. A chip
    keeps the web's anatomy — avatar, leading icon, status dot, trailing icon and remove
    control — and makes the remove control its own control with its own name, drawing its
    affordances from characters because this package ships no icon set; a consumer with a
    drawing passes `closeIcon` and the character stands in when they do not. An image is a
    frame that states the shape the platform cannot infer before a remote source arrives,
    claims its space with the framework's own `Skeleton`, and states the alternatives it
    cannot honour: a picture is fetched when its view mounts, so the web's `loading` option
    has no counterpart here and is not offered.
  - `@asheeui/core` gains the avatar, chip and image contracts (`components.avatar`,
    `components.chip`, `components.image`) and one module per component holding the class
    strings both renderers read, so a token or a picture is dressed from one place. The
    avatar's initials rule moves to the core as `getInitials`, because presenting an entity
    the same way is a promise the platform does not change.
  - `@asheeui/web` points its avatar, chip and image at those shared modules. The rendered
    markup and the public props are unchanged.
  - The parity queue drops from 18 to 15: 43 of the 58 components the matrix promises for
    native are implemented, and the remaining fifteen are the shells, the navigation
    furniture and the data family.
- da065da: Native gains the feedback and state family, and the rules those five share are stated
  once in `@asheeui/core`.
  
  - `@asheeui/native` implements `Alert`, `EmptyState`, `ErrorState`, `LoadingState` and
    the toast system (`ToastProvider`, `useToast`, `ToastItem`) with the platform's own
    mechanisms rather than a web one with the browser removed. A decoration is a character
    rather than a drawing, because the package ships no icon set and its other components
    already draw their affordances from text. The toast stacks its messages in a layer of
    its own, anchored to the bottom centre by default, because the platform's own snackbar
    cannot carry the title, the action or the dismissal the contract names — the same
    argument that keeps the native spinner a themed ring rather than an activity indicator.
    An `EmptyState` has no `as` prop, because the platform has one container, and the
    technical detail of an `ErrorState` is opened from the component's own state, because
    the platform has no `details` element.
  - `@asheeui/core` gains the five modules those components share with the web: the
    configuration both platforms agree on and the class strings each renderer compiles,
    native and web side by side. It also gains the two rules the family would otherwise
    have stated four times: `NATIVE_ANNOUNCEMENT_LIVE_REGION` with
    `resolveNativeAnnouncementRole`, which says how the framework's two levels of
    announcement are made on a platform that has no `status` role, and
    `NATIVE_MESSAGE_SURFACE_CLASS` with `NATIVE_MESSAGE_TEXT_CLASS`, which say what a
    message surface wears in each colour role. The alert and the toast read the same pair,
    so retuning one retunes the other. The toast's fallback timeout and queue depth live
    there too, because they are decisions about a reader's attention rather than about a
    platform.
  - `@asheeui/web` points its alert, empty state, error state, loading state and toast at
    those shared maps, and reads the shared queue limits. The rendered markup and the public
    props are unchanged.
  - The compatibility matrix's `Toast` entry now states what the platform actually does,
    and `scripts/native-parity.json` records `toast` in its overrides: the native
    counterpart of the web's toast module is published as `ToastProvider`, which is the
    component the matrix's guard looks for. The parity queue drops from 34 to 29.
- ba4222d: Native gains the field family, and the shared layer gains the vocabulary its members
  read.
  
  - `@asheeui/native` implements `Textarea`, `SearchInput`, `PinInput`, `Switch`,
    `Radio` with `RadioGroup`, `Dropmenu`, `MultiSelect`, `Autocomplete`, `Form`,
    `Stepper` and `FileUpload`. Each satisfies the contract its web counterpart already
    states and reads the same cascade, the same field vocabulary and the same label
    block; what differs is the platform, and where the platform forces a difference it
    is recorded in the matrix rather than hidden. A code field types into one native
    field behind its boxes, because a native control has a single caret. An
    autocomplete shows its suggestions under the field rather than floating them beside
    it, because a reader comparing what they typed with what it matches has to see both
    at once. A select and a multi-select pick from one surface at a time, because the
    platform has no floating layer, and a file field owns the zone, the list and the
    validation while the consumer wires the platform's own picker to `onChoose`.
  - `@asheeui/core` gains the configuration each member shares with the web plus the
    class strings each renderer compiles, native and web side by side: `switch`,
    `textarea`, `radio`, `search-input`, `pin-input`, `form`, `stepper` and
    `file-upload`. It also gains the rule the two platforms share for a code,
    `sanitizePinValue`, so a web field and a native field cannot filter the same input
    differently.
  - `@asheeui/web` points its switch, textarea, radio, search-input, pin-input, form,
    stepper and file-upload configuration and style modules at those shared modules, and
    re-exports the code field's rule. The rendered markup and the public props are
    unchanged.
  - `docs/native.md` records what shipped, why two members read the platform rather than
    a preference, and why `Calendar` stays queued: a native date field that accepted
    `time` and `datetime` without the platform's time picker would advertise an option
    it ignores. The parity queue shrinks accordingly — `pnpm check:native-parity` now
    reports 23 of 58 promised components implemented.
- 54d0ed8: Native gains the marketing and content blocks — `Hero`, `FeatureGrid`, `CTA` and `Footer` —
  and the band vocabulary those four share is stated once in `@asheeui/core`.
  
  - `@asheeui/native` renders each band with the platform's own layout kit. A hero measures the
    window and puts its media beside the text or under it, and moves the media through the tree
    rather than through an order class, which is the only way to state a side when there is no
    stylesheet. A feature grid reads the window for its column count and renders every feature
    through the framework's own `Card`, so a feature with a destination is a pressable card that
    follows it through the platform's URL handler and one without stays a surface. A call to action
    states the panel density the web states at its smallest step, because one window cannot pad
    itself for a desktop. A footer keeps its brand column above its groups and lets the groups wrap,
    and names each group's title as a heading a reader can move between.
  - `@asheeui/core` gains the four band contracts (`components.hero`, `components.featuregrid`,
    `components.cta`, `components.footer`), the shared grid vocabulary, and the band vocabulary the
    web and native renderers read side by side: the container widths, the background treatments, the
    heading step each size resolves to, and the class dictionaries for the heading block and the
    action row on both platforms. The four bands all extend the same option set, so a hero
    configured for a browser is configured for a device.
  - `@asheeui/web` points its hero, feature grid, call to action and footer at those shared modules,
    and its section kit at the shared heading and action dictionaries. The rendered markup and the
    public props are unchanged.
  - The native layout kit now reads the shared container and background vocabulary, so a `Section`
    written with `background="muted"` and a band written with the same option are talking about one
    idea. `none` paints the theme's own background, because a native screen has no page behind it to
    show through.
  - The native `Grid` now carries the column counts it is given for `md` and `lg`. The cascade
    resolves exactly the keys a fallback declares, so a key left out of the grid's fallback never
    reached it: a grid that stated a count per breakpoint fell back to its smallest count on every
    window, and now states the count the window actually reached.
  - The parity queue drops from 22 to 18: 40 of the 58 components the matrix promises for native are
    implemented, and the remaining eighteen are the shell, content and navigation families.
  - `@asheeui/web` states the tooltip's `className` fallback as well. The overlay increment added that
    option to the shared tooltip contract and left it out of the web fallback, so the package no
    longer type-checked; the value is the option's documented default and the component reads the
    configured value directly, so no rendered tooltip changes.
- e9539c4: Native gains the `MarketingLayout` composition, and the options it takes are stated once in
  `@asheeui/core`.
  
  - `@asheeui/native` holds the page's navigation, its main region of sections and its footer
    in one scrolling region, in the order the web shows them, with the sections inside the
    named main region. Every region is taken as a node, so a consumer passes the framework's
    own navigation, hero, feature grid, call to action and footer, and nothing about their
    content is decided by the composition.
  - What the platform states differently is what it has to scroll. The web is a document that
    grows with what it holds, so its shell is a full-height column and the document scrolls; a
    native screen is given its height by the platform, so the composition is the scrolling
    region itself.
  - Two options the platform keeps in its own vocabulary. The web's skip link is a keyboard
    reader's way past the navigation, and a platform screen has no focus order to skip through,
    so `skipLink` and `skipLinkLabel` resolve through the shared contract and render nothing.
    The web names its main region with an `id` so a link can point at it; the platform names a
    view with `nativeID`, which is the identifier its own reader can be pointed at, so `mainId`
    becomes that.
  - `@asheeui/core` gains the marketing-layout contract (`components.marketinglayout`) and one
    module holding every class string both renderers read: the shell, the background each
    renderer paints, the scrolling content and the main region.
  - `@asheeui/web` points its composition at those shared modules and its own styles file is
    removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 6 to 5: 53 of the 58 components the matrix promises for native
    are implemented, and the remaining five are the navigation furniture and the three layout
    shells that compose it.
- 1a69cbb: Native gains `Marquee`, and the options it moves by are stated once in `@asheeui/core`.
  
  - `@asheeui/native` moves the content the way the platform can. The web states a keyframe
    animation over a track it has already sized in its stylesheet and translates it by half;
    the platform has neither, so it measures the content once the platform has laid it out,
    keeps an animated value of its own, and translates by the measured length of one set plus
    the gap — the exact distance at which the second copy has taken the first copy's place, so
    the loop has no seam. Until the content has been measured nothing moves, rather than
    jumping to a position nobody chose.
  - The copy is in the tree twice and kept out of the accessibility tree rather than off the
    screen, so a reader hears the items once while the loop still has something to move into
    place — the same promise the web keeps with `aria-hidden`.
  - The movement yields to the platform's own motion setting, through a new
    `useReduceMotion` hook, exactly as the web's yields to the reader's preference: a reader
    can turn the setting on while a screen is open, so the loop follows it and the content is
    read standing still. The new shared `isAnimated` option states the same thing
    deliberately, for a screen that must not move at all, and the web honours it as well.
  - Two of the contract's options are the web's to keep. `pauseOnHover` is a pointer's
    gesture and a touch screen has no pointer resting on anything; `fadeEdges` is a gradient,
    which the platform paints only through a drawing library this package does not depend on,
    and a band of the background colour would be a hard edge pretending to be a fade. Both
    still resolve through the shared contract and are documented as empty classes, so one
    configuration describes both platforms and neither option is silently stripped.
  - The shared gap is a CSS length, because it is one value for both platforms. The platform
    reads it as its own measure (`resolveLength`): the framework's `rem` is sixteen
    density-independent pixels, a `px` is one, and a unit a view cannot state falls back to
    the framework's own gap rather than to a number nobody chose.
  - `@asheeui/core` gains the marquee contract (`components.marquee`) and one module holding
    every class string both renderers read: the frame, the track, the sets, the items, the
    fade gradients and the two native substitutions.
  - `@asheeui/web` points its marquee at those shared modules and its own styles file is
    removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 12 to 11: 47 of the 58 components the matrix promises for
    native are implemented.
- 15e52a4: Native gains the navigation and disclosure family, and the class dictionaries those four
  share are stated once in `@asheeui/core`.
  
  - `@asheeui/native` implements `Link`, `Tabs`, `Accordion` and `Carousel` with the
    platform's own behaviour rather than with an imitation of the browser's. A link underlines
    itself while it is pressed and follows its destination through the platform's URL handler
    unless the consumer handles the press or names the component that renders it. A tab bar
    scrolls with the platform's scroll view, and is a row of tabs rather than one tablist,
    because a container that is an accessibility element hides the controls inside it. An
    accordion opens with the platform's own layout animation and does not draw a closed panel
    at all, which is what takes it out of the accessibility tree — the platform's answer to the
    web's `inert`. A carousel pages with the platform's scroll view, which is why `loop` wraps
    only its autoplay: a scroll view that teleported its content would be lying about where the
    reader is.
  - `@asheeui/core` gains the four modules those components share with the web: the
    configuration both platforms agree on and the class strings each renderer compiles, native
    and web side by side. Two of them state what a component that has no treatment for the
    platform's filled default does instead, which is resolve it to the treatment the component
    documents.
  - `@asheeui/web` points its link, tabs, accordion and carousel at those shared maps. The
    rendered markup and the public props are unchanged.
  - `scripts/native-parity.json` drops from 29 to 25: 33 of the 58 components the matrix
    promises for native are now implemented.
- 6a5eeba: Native gains the overlays — `Modal`, `Drawer` and `Tooltip` — and the class dictionaries those
  three share are stated once in `@asheeui/core`.
  
  - `@asheeui/native` presents each overlay the way the platform does rather than the way the
    browser does. A modal is the platform's own modal presentation, which takes the screen, keeps
    the reader inside it and hands the framework the platform's way out; the surface takes its own
    presses, so pressing what a dialog holds never dismisses it. A drawer is the sheet the platform
    uses for this — a panel at the side of a phone has nowhere to be, so a side placement resolves
    to the sheet while a top or bottom placement keeps its edge. A tooltip is shown on a long press,
    with the same `delay` the web counts as the length of that press, placed against the platform's
    own measurement of its trigger, and stated as the trigger's accessibility hint as well, so a
    reader using assistive technology is told it without finding the gesture.
  - `@asheeui/core` gains the three modules those components share with the web, including two maps
    that say what the platform does with a placement it has no room for, and the modal's own width
    scale, which is not the framework's three densities.
  - `@asheeui/web` points its modal, drawer and tooltip at those shared maps. The rendered markup
    and the public props are unchanged.
  - The parity queue drops from 25 to 22: 36 of the 58 components the matrix promises for native
    are implemented, and the remaining twenty-two are the marketing, content and shell families.
- 54d0ed8: Native gains the application-screen shell — `Page`, `PageHeader`, `PageContent` and
  `PageFooter` — and the options those four share are stated once in `@asheeui/core`.
  
  - `@asheeui/native` renders the shell the way a screen is built rather than the way a document
    is. The shell is a full-height column that grows into the height the platform gives it; the
    header announces itself as the platform's header landmark, and the parts are contained by
    default, so a screen gets the framework's width and gutter without extra markup. The one
    option the platform cannot honour in place is `sticky`: a native screen has no scroll-linked
    positioning, so a bar that must stay in view belongs outside the scrolling region — the
    platform's own way of pinning a bar — and the resolved value is kept so one configuration
    still describes both platforms. The header also paints the theme's background solidly where
    the web bar is translucent and blurs what scrolls behind it, because there is no backdrop to
    filter.
  - `@asheeui/core` gains the page contract (`components.page`) and one module holding every
    class string both renderers read: the shell, the two bars, the content area, the separators
    and the inner rows, per platform. The web's header row states no direction, because a block
    element lays its children out along the row already; the platform's states the direction it
    means rather than relying on a default.
  - `@asheeui/web` points its four page parts at those shared modules. The rendered markup and
    the public props are unchanged.
  - The parity queue drops from 14 to 13: 45 of the 58 components the matrix promises for native
    are implemented, and the remaining thirteen are the shells, the navigation furniture and the
    data family.
- 5ee11fe: Native gains the `Pagination` collection footer, and the options it reads are stated once in
  `@asheeui/core`.
  
  - `@asheeui/native` states where a reader is in a paged collection and loads more of it,
    because that is how a platform list moves through a collection: the web draws a numbered
    trail — the first and last page, the reader's neighbours, a gap between them and a control
    for each, as a link when addresses are supplied and a button otherwise — and a phone has
    no room for a trail and no address to name. The footer states its position, which is a
    live region so a reader hears where they are as pages load, offers one control that loads
    the next page, and offers nothing once the collection is exhausted; a collection with no
    pages renders no footer at all, because an empty state belongs to the list.
  - The footer never reports a page the collection cannot act on: it clamps the current page
    to the collection, and a press during a load is ignored because the control is disabled.
  - Two options the web's trail needs are stated rather than hidden. `siblingCount` and
    `showEdges` describe how many neighbours to draw and whether the collection's ends are
    offered; the platform's footer draws no range, so they resolve through the shared contract
    — one configuration describes both platforms — and change nothing here. The tests state
    that, so it stays true.
  - `@asheeui/core` gains the pagination contract (`components.pagination`) and one module
    holding every class string both renderers read, including the control and disabled
    treatments the web renderer used to state inline.
  - `@asheeui/web` points its pagination at those shared modules and its own styles file is
    removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 9 to 8: 50 of the 58 components the matrix promises for native
    are implemented.
- 89cce39: Native gains the `PricingCard` pattern, and the options it takes are stated once in
  `@asheeui/core`.
  
  - `@asheeui/native` renders a plan in the framework's own `Card` and the framework's own
    `Text`, and places several plans with `Stack` exactly as the web places several with
    `Grid`. The plan's name heads the card as the platform's header role, so a reader can move
    from plan to plan.
  - Three things the web draws are stated the platform's way. Included and excluded features
    carry characters rather than drawings, because this package ships no icon set (the
    framework's tick and the dismissal glyph the rest of the native components already draw).
    The recommended plan is marked with the card's own `color`, which is the accent every
    other native surface states, rather than with a ring the platform's card does not paint.
    An elevated plan keeps the raised surface's own colour, because the platform's card paints
    no shadow: the web's `elevated` surface is the framework's filled surface with a shadow,
    and a bordered surface would be the wrong treatment rather than a plain one.
  - The exclusion is stated in words as well as in style on both platforms, and the shared
    module for text that is read rather than seen is now stated once in `@asheeui/core`
    (`VISUALLY_HIDDEN_CLASS` and its native counterpart), rather than beside each component
    that needs it.
  - `@asheeui/core` gains the pricing-card contract (`components.pricingcard`, including the
    `PricingFeatureItem` line the props carry) and one module holding every class string both
    renderers read.
  - `@asheeui/web` points its pricing card at those shared modules and its own styles file is
    removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 11 to 10: 48 of the 58 components the matrix promises for
    native are implemented.
- 232e1b5: Native gains `RowList`, the platform's rendering of the `Table` and `DataTable` contracts,
  and both contracts are stated once in `@asheeui/core`.
  
  - `@asheeui/native` reads a collection the way a phone does: one surface per row, and one
    labelled line per column, so a reader hears what each value means rather than a sequence of
    values. A table is not a native reading pattern — columns cannot be laid out side by side
    and read as a row on a phone — which is why the two contracts land on one component.
  - It renders the data table's furniture at the same time, through the framework's own
    components: a heading, a search field when the list knows what to search, the rows, an
    empty presentation when nothing matches, a count of what is showing (a live region, so a
    reader who searches or pages is told), and the platform's own collection footer to move to
    the next page. A consumer that restyles one of those restyles the list.
  - A row a consumer can act on is a control that reports its press; a chosen row states the
    accent at full weight and is marked as chosen for assistive technology as well as for the
    eye. The web's double-press handler has no counterpart, because a phone has no
    double-click, so the list takes a single row press.
  - The table's variants resolve to the surface each row is drawn on — a defined surface for
    the variants that separate cells with an edge, the framework's tinted surface for the
    striped one, and no surface for the ghost one — and `headerClassName` names a row the
    platform does not draw, so it resolves through the contract and changes nothing here.
  - `@asheeui/core` gains the table contract (`components.table`, with the `ColumnDef` a column
    is described by) and the data-table contract (`components.datatable`), plus one module per
    contract holding the class strings both renderers read.
  - `@asheeui/web` points its table and its data table at those shared modules and their own
    styles files are removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 8 to 6: 52 of the 58 components the matrix promises for native
    are implemented, and the remaining six are the navigation furniture and the layout shells.
- Native gains the screen shell — `Navbar` (with its `TabBar`), `Sidebar`, `SidebarLayout`,
  `DocsLayout` and `AuthLayout` — and the five contracts those components state are defined once
  in `@asheeui/core`.
  
  - `@asheeui/native` builds them the way a screen is built rather than the way a document is, and
    each one records what the platform decided instead of imitating the web. A bar scrolls its row
    of destinations rather than opening the web's disclosure, because a browser's bar is a single
    line it cannot scroll sideways and a platform's is not, so `mobileOpen`, `onMobileOpenChange`
    and `mobileLabel` resolve through the shared contract and change nothing; the current
    destination is stated as the control's selected state where the web states `aria-current`. The
    module also publishes `TabBar`, the platform's own second half of a navigation. A sidebar
    collapses to a rail, its rows render through the framework's own `Link` so a consumer keeps its
    routing, and a collapsed row explains itself through the framework's native `Tooltip`, which the
    platform shows on a long press. `SidebarLayout` and `DocsLayout` are stacked screens: the shell
    asks `useBreakpoint` once and states the direction it means, places the column outside the
    consumer's scrolling region rather than pinning it, and a documentation page's three regions
    become three stacked sections, each headed with the name the web gives its landmark. `AuthLayout`
    is what fills the height the platform gives the screen, with the media column decided once by
    `useBreakpoint`. All five register their defaults with the native registry, so
    `components.sidebar` and its four siblings resolve through the same cascade as everything else.
  - `@asheeui/core` gains the five contracts — `components.sidebar`, `components.sidebarlayout`,
    `components.navbar`, `components.docslayout` and `components.authlayout`, including the shared
    description of an item, a destination and a region — and one module per component holding every
    class string both renderers compile, per platform, side by side.
  - `@asheeui/web` points the same five components at those shared modules. The rendered markup and
    the public props are unchanged.
  - The parity queue drops from 5 to 0: all 58 components the matrix promises for native are
    implemented, so `scripts/native-parity.json` holds no queued module. What the increment leaves
    is a published package waiting on a consumer's own screen rather than another component.
- ba4222d: Native gains `Spinner` and `Skeleton`, and the compatibility matrix gains an
  enforcer, so a component the matrix promises for native cannot go missing.
  
  - `@asheeui/native` implements the two components with its own mechanism rather
    than a web one with the browser removed. `Spinner` draws its ring from the
    theme's classes and rotates it with React Native's `Animated` on the native
    thread, because a platform activity indicator takes a colour *value* while the
    contract names a colour *role*: a control that cannot resolve the role would
    take the prop and ignore it. `Skeleton` mirrors the shared pulse contract and
    stays hidden from assistive technology unless it is labelled.
  - `@asheeui/core` gains the `spinner` and `skeleton` modules those two share with
    the web: the configuration both platforms agree on and the class strings each
    renderer compiles, native and web side by side. Both renderers read one source,
    so a change to either scale is one edit.
  - `@asheeui/web` points its spinner and skeleton at those shared class maps. The
    rendered markup and the public props are unchanged.
  - `scripts/check-native-parity.mjs` reads the compatibility matrix at its source
    and asks what `@asheeui/native` publishes, by following the package's re-exports
    from its entry point. It fails when a component the matrix promises for native
    is neither exported nor queued, when an exported component still sits in the
    queue, and when the queue names a module the matrix does not promise for native.
    The queue lives in `scripts/native-parity.json` and may only shrink: shipping a
    queued component fails the check until its entry is removed. `pnpm
    check:native-parity` runs it locally, `--list` prints the whole expectation
    table, and CI runs it on every change.
- 54d0ed8: Native gains the `Split` layout primitive, and the module it reads is stated once in
  `@asheeui/core`.
  
  - `@asheeui/native` renders two panes that stack while the window is narrow and sit side by
    side once it is wide enough. The web states the breakpoint as a variant prefix because a
    browser has media queries; the platform has none to imitate, so the component asks
    `useBreakpoint` what the window has reached and decides the direction, the division of the
    width and the edge the separator sits on from the answer. Both panes stay in the tree at
    every width, which is the same promise the web keeps by leaving them in the document.
  - `@asheeui/core` gains the split contract (`components.split`) and one module holding every
    class string both renderers read: the stacking, the alignment, the division of the width,
    the separator and the sticky treatment, per platform. `stickyEnd` is a shared option the
    platform has nothing to say about, because it has no scroll-linked positioning; it is stated
    as an empty class rather than dropped, so a screen configures one shell for both platforms.
  - `@asheeui/web` points its split at those shared modules. The rendered markup and the public
    props are unchanged.
  - The parity queue drops from 15 to 14: 44 of the 58 components the matrix promises for native
    are implemented, and the remaining fourteen are the shell, page-furniture and data families.
- 398ba4b: Native gains the `Testimonials` band, and the band's options are stated once in
  `@asheeui/core`.
  
  - `@asheeui/native` renders a heading and a responsive grid of attributed quotes, each in
    the framework's own `Card` and each credited through the framework's own `Avatar`, so the
    band inherits the framework's surfaces and the avatar's substitution API and initials
    fallback without the consumer doing anything. It composes the platform's `Section`,
    `Container` and `Grid`, so a band written for a browser is a band on a device.
  - What differs is where the attribution's meaning lives. The web renders each quote as a
    `figure` with its `figcaption` inside a list, so a browser announces a set of attributed
    quotations. The platform has no list and no figure, so the band keeps the words and the
    attribution in one surface and in that order — the words first, then who said them — which
    is the same promise stated the way the platform can keep it.
  - `@asheeui/core` gains the testimonials contract (`components.testimonials` and the
    `TestimonialItem` a quote is described by) and one module holding every class string both
    renderers read. The band options themselves come from the shared `section-block` vocabulary
    every band reads, so a testimonials band and a feature grid answer the same questions the
    same way.
  - `@asheeui/web` points its testimonials at those shared modules and its own styles file is
    removed. The rendered markup and the public props are unchanged.
  - The parity queue drops from 10 to 9: 49 of the 58 components the matrix promises for
    native are implemented.
- Updated dependencies [ba4222d]
- Updated dependencies [a12c250]
- Updated dependencies [54d0ed8]
- Updated dependencies [da065da]
- Updated dependencies [ba4222d]
- Updated dependencies [54d0ed8]
- Updated dependencies [e9539c4]
- Updated dependencies [1a69cbb]
- Updated dependencies [15e52a4]
- Updated dependencies [6a5eeba]
- Updated dependencies [54d0ed8]
- Updated dependencies [5ee11fe]
- Updated dependencies [89cce39]
- Updated dependencies [232e1b5]
- Updated dependencies
- Updated dependencies [ba4222d]
- Updated dependencies [54d0ed8]
- Updated dependencies [398ba4b]
- Updated dependencies [ba4222d]
  - @asheeui/core@2.2.0

## 2.0.0

### Major Changes

- The library becomes a system. The component inventory grows from 51 to 61, the
  layout layer gains the two primitives that were missing, four full-page
  compositions make a whole page expressible without a second library, and the
  native package gains a component set and a responsive vocabulary. Every
  component, prop and configuration key from 1.1.x is still supported, so an
  existing application upgrades by changing the version.

- The layout layer is complete: `Centered` places one block in the space it is
  given, with the axis, the room it claims and an optional container as options,
  and `Split` puts two panes side by side from a chosen breakpoint, with a ratio, a
  divider and a sticky second pane. Below the breakpoint the panes stack rather
  than hide, so the content stays reachable with the keyboard.

- Four full-page compositions: `MarketingLayout` (navigation, one `main` landmark
  holding the sections, a footer, and the skip link as the first focusable
  element), `DocsLayout` (a navigation column, an article and an optional table of
  contents), `SidebarLayout` (the application shell) and `AuthLayout`.

- Six components and patterns: `SearchInput`, `Stepper`, `DataTable`,
  `LoadingState`, `ErrorState` and `FileUpload`, each composed from what the
  library already had rather than from a new set of primitives. `Chip` takes a
  `closeLabel`, so one remove control per chip says what it removes, and
  `EmptyState` takes `actions` for actions that carry a React handler.

- Corrections, all of which are behaviour rather than interface: `SidebarLayout` no
  longer turns its whole shell into a row at the `lg` breakpoint, so a header and a
  footer span the page at every width instead of sitting beside the columns, which
  is the only visual change an existing application sees; the `EmptyState` example
  no longer passes a handler inside a configured action, where it was dropped
  silently; and `SearchInput`'s landmark is a search region whose shortcut hint is
  read as part of the field.

- The playgrounds, and getting one: the repository's four playground applications
  became one application with a door per framework, written entirely in AsheeUI
  with an empty configuration, and `@asheeui/cli` `0.7.0` gained
  `asheeui playground`, which copies that application into a project that installs
  on its own. See `docs/playgrounds.md`.

The release notes, including what is deferred and why, are in
`docs/release-2.0.0.md`.

## 1.1.1

### Patch Changes

- c218002: Relicensed the project under the Apache License 2.0, and published the
  attribution with the packages: `LICENSE` and `NOTICE` now ship in both tarballs
  and every manifest states `Apache-2.0`. Apache-2.0 grants everything the previous
  license granted and adds an express patent license, a patent-retaliation clause
  and an explicit attribution requirement. Versions published under MIT stay MIT;
  `docs/licensing.md` records the terms, the trademark position and the transition.

## 1.1.0

### Minor Changes

- d988082: Added the layout system (`Container`, `Section`, `Stack`, `HStack`, `VStack`,
  `Grid`, `Page`, `PageHeader`, `PageContent`, `PageFooter`, `SidebarLayout`,
  `AuthLayout`), the page sections (`Navbar`, `Hero`, `FeatureGrid`, `CTA`,
  `Testimonials`, `PricingCard`, `Footer`), the state and utility components
  (`EmptyState`, `PinInput`, `Clipboard`, `CopyButton`) and the `asheeui/puck`
  entry point with the Puck block configuration, its reusable fields and the
  published-page rendering test. Nothing in the 1.0 API changed; the CLI reports
  the widened inventory of 51 components.

## 1.0.0

### Major Changes

- Release 1.0.0.
  
  The public API is frozen: the 34 components, the configuration cascade, the theme
  system, the substitution API shared by `Link`, `Image` and `Form`, and the
  accessibility behaviour the framework guarantees.
  
  From this release a breaking change follows the deprecation policy published in
  the documentation: an API is deprecated for at least one minor release before it
  is removed, and removal happens only in a major release.

### Minor Changes

- 7a9c44d: Remove internal helpers that were public by accident.
  
  The package root no longer exports `getInitials` (avatar), `getPaginationRange`
  and the `PaginationRangeItem` type (pagination), or the radio group context
  (`RadioContext`, `RadioContextValue`, `useRadioGroupContext`). Each of these
  serves one component, is not documented as public API, and every other
  component keeps its equivalent private.
  
  Migration: stop importing them from `asheeui`. The components use them
  internally and no public API depends on them. This is a pre-1.0 breaking change,
  so no compatibility alias is provided.
- 384efcc: Give `Link`, `Image` and `Form` the same substitution API.
  
  The substitution capability is now decided once and applied identically to the
  three primitives: `component` names the component that replaces the native
  element, and `componentProps` carries the props it needs. The previous names
  differed per component.
  
  | Before | After | Migration |
  | --- | --- | --- |
  | `Link`: `linkComponent`, `linkProps` | `component`, `componentProps` | Rename both props. |
  | `Image`: `props` | `componentProps` | Rename the prop. `component` is unchanged. |
  | `Avatar`: `imageProps` | `componentProps` | Rename the prop. `component` is unchanged. |
  | `Breadcrumb` step: `linkComponent`, `linkProps` | `component`, `componentProps` | Rename both keys on the step. |
  | `Card` image and link config: `props` | `componentProps` | Rename the key. `component` is unchanged. |
  | `Form` | `component`, `componentProps` | New. A framework form primitive can replace the native element. |
  
  These are pre-1.0 breaking changes, so no compatibility alias is provided.

### Patch Changes

- 23987a5: Apply the structural scrollbar configuration.
  
  The scrollbar shape and behaviour set under `components.scrollbar` had no effect:
  the stylesheet reads `--ashee-scrollbar-*`, and nothing emitted those variables.
  They are now written into the theme style element alongside the theme colours, so
  `width`, `radius`, `trackRadius`, `thumbBorder` and `gutter` apply as documented.
  `trackRadius` still falls back to `radius` when it is not set.
- 61c65be: Apply the theme variables on a client-only render.
  
  The pre-paint theme script applies the theme before the first paint, but a
  browser only runs a script that arrives with the server markup. In a
  client-rendered application the element was inert, so the theme CSS variables
  were never injected and every component that resolves its colours through them
  fell back to nothing.
  
  The provider now applies the variables before the first paint in that case, and
  it no longer renders the script where it could not run. That last part also
  removes the React warning about a script rendered on the client.

## 0.8.0

### Minor Changes

- 96da722: Conform the interactive components to the accessibility baseline.
  
  **Dialogs.** `Modal` and `Drawer` render in a portal, take their accessible name from the `aria-label` or
  `aria-labelledby` a consumer passes, move focus into the dialog when it opens, keep focus inside it while it is open,
  return focus to the element that was focused before it opened, expose the backdrop as decoration only (hidden from
  assistive technology and out of the tab order), and lock body scroll while they are open.
  
  **Selection family.** `Dropmenu`, `MultiSelect` and `Autocomplete` expose their suggestion list as a listbox of
  options with selection state and disabled state, name each option with its label, take the trigger's accessible name
  from the field label, and link the description and the validation message to the trigger. The whole family is now
  operable from the keyboard: arrow keys open and move, Home and End jump to the list edges, Enter selects, Escape
  dismisses, typing matches an option, and focus returns to the trigger when the list closes. `MultiSelect` keeps an
  accumulated selection while it is uncontrolled and reports that it accepts more than one selection.
  
  **Calendar.** The month is a grid of labelled day cells that expose the selected day, today, and the day the keyboard
  is on. Arrow keys move by day and by week, PageUp and PageDown move by month, and Escape closes the popover.
  
  **Forms and structure.** `Switch` links its description to the control. A radio group is named by its label, links
  its description and message, and selects an uncontrolled value from `defaultValue`. A collapsed `Accordion` panel is
  inert and hidden from assistive technology. `Sidebar` exposes the active item with `aria-current` and follows its own
  collapsed state while it is uncontrolled.
  
  **Motion.** `Marquee` and `Carousel` stop their automatic motion when the operating system asks for reduced motion.
- 9adecc8: Add the `Alert` component.
  
  Alert renders an inline message or validation summary whose colour, variant and radius resolve through the framework
  cascade. Its intent selects the colour and the urgency of the announcement: `error` and `warning` are exposed as an
  alert, `info` and `success` as a status, and `role` overrides either. An alert never takes or moves focus, and its
  optional dismiss control carries an accessible name.
- c9f0b4c: Add the `Avatar` component.
  
  Avatar represents a person or an entity with a picture, and falls back to that entity's initials when there is no
  picture or the picture fails to load. The picture is rendered through the framework's `Image` primitive, so a
  consumer keeps its own image component by passing `component`. The avatar carries the entity's name as a single
  labelled image role, and is hidden from assistive technology when it names nothing. Diameter, radius and the fallback
  colour resolve through the framework cascade.
- 3818f85: Add the `Badge` component.
  
  Badge renders a compact status or label indicator, with the framework's colour, variant, size and radius axes and a
  configuration section under `components.badge`. An icon-only badge carries its text through the `label` prop, which is
  what assistive technology reads, and an icon beside it is decoration.
- 165f299: Add the `Breadcrumb` component.
  
  Breadcrumb renders a hierarchical navigation trail as a named navigation landmark over an ordered list. The current
  location is presented as text with `aria-current` rather than as a link, separators are decoration, and the linked
  steps are rendered through the framework's `Link` primitive, so a consumer keeps its router link. The trail's scale
  and link colour resolve through the framework cascade.
- 02aee6f: Change the built-in default radius and variant.
  
  Components now default to a boxy corner radius (`xs`) and a faded fill, matching the framework's confirmed visual
  language. The previous built-in defaults were `md` and `solid`.
  
  Consumers who prefer the previous look set `defaultRadius: "md"` and `defaultVariant: "solid"` in their
  configuration, or set them per component under `components`.
- 42e8f99: Rename `Select` to `Dropmenu`, `DatePicker` to `Calendar`, and `TextArea` to `Textarea`.
  
  These are pre-1.0 breaking renames: the old names are gone, and no compatibility alias is provided before 1.0.
  
  | Before | After | Migration |
  |---|---|---|
  | `Select`, `SelectProps` | `Dropmenu`, `DropmenuProps` | Rename the import, the element, and the props type. |
  | `DatePicker`, `DatePickerProps` | `Calendar`, `CalendarProps` | Rename the import, the element, and the props type. |
  | `TextArea`, `TextAreaProps` | `Textarea`, `TextareaProps` | Rename the import, the element, and the props type. |
  
  Configuration keys follow the component names, so `components.select` becomes `components.dropmenu`,
  `components.datePicker` becomes `components.calendar`, and the `datePicker` sub-keys inside it become `calendar`
  (`calendar.mode`, `calendar.picker`). `components.textarea` is unchanged.
  
  Internal naming changed with them, which consumers do not import: the shared menu helper `select-menu` (with
  `SelectMenu`, `SelectMenuOption`, `useSelectFloating`, and `FALLBACK_SELECT_MENU_CONFIG`) is now `Menu`
  (`Menu`, `MenuOption`, `useMenuFloating`, and `FALLBACK_MENU_CONFIG`), and the internal date grid is `DateGrid` so it
  can no longer be confused with the public `Calendar`. Component directories are `components/dropmenu` and
  `components/calendar`.
- 58722fd: Add the `Form` component.
  
  Form is a deliberately thin wrapper over the native form element, in the same way `Link` wraps the anchor and `Image`
  wraps the picture. It preserves native submission and validation: `action`, `method`, `encType`, `target`,
  `noValidate` and the submit event pass through unchanged, and the forwarded ref reaches the element itself, so a form
  library binds to it exactly as it binds to a plain form. A `legend` groups the fields, and `submitLabel` renders an
  AsheeUI `Button` as the submit control, with `isPending` showing a submission in progress. The component introduces no
  form state of its own, and the substitution API for a framework-specific form is left to the decision that resolves
  it.
- 274cb07: The public component inventory is now derived from the public export surface.
  
  `asheeui`: the internal form-field helper (`field`, including `FieldShell`) and the internal `MenuOption` type
  from the menu helper are no longer re-exported from the package entry point. They were always implementation details
  shared by the components that use them, and exposing them made internal building blocks look like public components.
  This is a breaking change for code that imported them from `asheeui`. Migration: stop importing internal helpers and
  use the public components instead (`Input`, `Textarea`, `Radio`, `Switch`, `MultiSelect`, `Dropmenu`,
  `Autocomplete`). This is a pre-1.0 breaking change and no compatibility alias is provided.
  
  `@asheeui/cli`: `asheeui list` now derives the component inventory from the package's public export surface instead
  of scanning the `components/` directory tree. Internal helpers can no longer appear, and the `scrollbar`
  configuration module is no longer reported as a component. The reported inventory follows the public export
  surface. Both a source entry module and a built entry module are supported.
- a9c3f7d: Add the `Pagination` component.
  
  Pagination renders controls for moving through a paged collection: a named navigation landmark over an ordered list,
  the current page marked with `aria-current`, the first and last pages always offered, and a longer range collapsed
  into a gap. The controls are links when the consumer supplies `hrefForPage` and buttons reporting `onPageChange`
  otherwise, and their size, variant, colour and radius resolve through the framework cascade.
- 98ddb88: Add the `Skeleton` component.
  
  Skeleton renders a loading placeholder whose radius and shimmer resolve through the framework cascade. It is hidden
  from assistive technology by default, becomes a labelled busy status when `isBusy` marks it as standing in for a
  loading region, and shimmers through a reduced-motion-safe class so the animation stops for a consumer who asked for
  less motion.
- 6e9dee5: Add the typography system: semantic roles, token maps and a `Typography` component.
  
  `Typography` renders the semantic element a role implies and applies that role's complete, static class string.
  Eleven roles are provided (`display`, `heading-xl`, `heading-lg`, `heading-md`, `heading-sm`, `body-lg`, `body-md`,
  `body-sm`, `label`, `caption`, `overline`), together with size, weight, leading, tracking, tone and alignment tokens.
  
  - Colour is applied through `tone`, which resolves framework colour tokens, so standard text needs no Tailwind colour
    utilities.
  - Any part of a role's treatment can be overridden per instance (`size`, `weight`, `leading`, `tracking`), and
    `components.typography.roles` retunes a role application-wide without changing its meaning.
  - The ARIA `role` attribute is not forwarded, because `role` is the typography role.
  - `as` selects the element without changing the treatment.
  
  Additive and pre-1.0: no existing component, default, or dependency is affected. The public component inventory grows
  from 26 to 27.

### Patch Changes

- eca0778: Keep a busy control's name.
  
  A button that is loading used to replace its label with the word "Loading", so assistive technology announced
  "Loading" without saying which action was running. The label now stays in the accessible name while the control is
  busy, and the busy state is carried by `aria-busy`.
- 60f2456: Fix: the structural scrollbar configuration is now registered with the component registry.
  
  The scrollbar configuration module was not imported anywhere, so its defaults were never registered and
  `config.components.scrollbar` could not be resolved. The package entry point now imports it for its registration
  side effect, matching how every other component config module registers. The module is still not exported, so it
  remains outside the public component inventory.
  
  Tooling: the dangling `build:registry` script was removed from `packages/ui/package.json`; it pointed at
  `src/scripts/build-registry.ts`, which no longer exists.
  
  Packaging: `sideEffects` now also lists the component config modules (`**/*-config*`). The previous value (`*.css`)
  told bundlers that every JavaScript module was free of side effects, so registration imports that exist only for
  their side effect were silently dropped from bundles. This was observed in the published build, where the scrollbar
  registration was removed until the field was corrected.
- Prove server rendering and hydration for the part 1 components.
  
  `Badge`, `Skeleton`, `Alert`, `Avatar`, `Breadcrumb`, `Pagination` and `Form` are rendered on the server by any
  framework that server-renders its client components, so each one now has a server-rendering test that runs with no DOM
  present and a hydration check that fails if the first client render differs from the server markup. No public API
  changed: this is evidence, not behaviour.
- fe10bd6: Ignore a stored theme the configuration does not define.
  
  The pre-paint theme script applied whatever theme name it found in local storage, even when the configuration
  defined no CSS block for it, which could leave the page unstyled until the theme controller corrected it after
  hydration. The script now validates the stored value against the configured themes and never applies a theme class
  that has no generated CSS. The theme controller already behaved this way.
- 9e8f7af: Announce notifications to assistive technology.
  
  Toast notifications now carry a status role, so assistive technology announces them politely when they appear. The
  container that stacks them was already a labelled region, which is what lets an announcement be placed in context.

## 0.7.0

### Minor Changes

- ### Floating layer standard (new)
  
  - Introduced a single floating-layer standard so portaled popups layer correctly against both AsheeUI components and arbitrary client components (including custom navbars), with no manual `z-index` configuration required.
  - Added `utils/stacking.ts`: `ASHEE_LAYER` (small per-layer deltas: `dropdown: 10`, `popover: 20`, `tooltip: 30`), `ASHEE_GLOBAL_LAYER` (fixed app-level rungs: `overlay: 1000`, `docked: 1500`, `toast: 2000`), `establishesStackingContext`, `resolveBaseZIndex`, and `resolveFloatingZIndex`. `establishesStackingContext` covers the full CSS stacking-context list (fixed/sticky, positioned + `z-index`, `opacity`, `transform`, `filter`, `backdrop-filter`, `perspective`, `clip-path`, `mix-blend-mode`, `isolation`, `will-change`, `contain`) and the ancestor walk crosses shadow DOM hosts. These are re-exported from the `utils` barrel.
  - Added the `useFloatingZIndex` hook (`libs/use-floating-z-index.ts`): derives a portaled element's `z-index` as `outermost stacking-context z-index of the trigger + layer delta`, measured in a layout effect so the corrected value lands before paint (no flash at the wrong layer). Floating UI virtual elements are ignored.
  - Anchored popups (Select, MultiSelect, Autocomplete, SelectMenu, DatePicker, Tooltip) now derive their `z-index` from the trigger's stacking context. A popup opened from a navbar renders above that navbar, while a popup opened from the page stays underneath it, regardless of the numeric `z-index` a client assigns to their chrome.
  - Removed the hardcoded floating `z-index` classes that the standard replaces: `z-30` (SelectMenu), `z-100` (DatePicker), `z-50` (Modal/Drawer), `z-9999` (OnScreenKeyboard), `z-99999` (Toast), and the tooltip's `z-99999` escape hatch.
  - App-level overlays now use the fixed `ASHEE_GLOBAL_LAYER` rungs instead of ad-hoc classes: Modal/Drawer `1000`, OnScreenKeyboard `1500`, Toast `2000`. Modal and Drawer now render above high `z-index` navbars.
  
  ### Tooltip
  
  - Added a `portal` option (default `false`). When `false` the tooltip renders in place next to the trigger and follows the trigger's own stacking context; when `true` it is appended to `document.body` via `FloatingPortal` for triggers inside scrollable or clipped containers. This is a behavior change from the previous always-portaled implementation.
  - Added a `zIndex` option (layer delta, defaults to `ASHEE_LAYER.tooltip`).
  - Portaled tooltips apply the derived `z-index`; in-place tooltips apply none, because they already follow the trigger's stacking context.
  
  ### SelectMenu / useSelectFloating
  
  - Added a `zIndex` option (defaults to `ASHEE_LAYER.dropdown`); the derived value is merged into the returned `floatingStyles`, so Select, MultiSelect, Autocomplete, and DatePicker layer correctly with no per-component wiring.
  - SelectMenu no longer hardcodes `z-30`; the value now arrives through `floatingStyles`.
  
  ### DatePicker
  
  - Passes `zIndex: ASHEE_LAYER.popover` to the shared floating hook and no longer hardcodes `z-100`.
  
  ### Modal / Drawer / OnScreenKeyboard / Toast
  
  - Switched to the shared `ASHEE_GLOBAL_LAYER` rungs (Modal/Drawer `overlay: 1000`, OnScreenKeyboard `docked: 1500`, Toast `toast: 2000`), replacing the per-component `z-50` / `z-9999` / `z-99999` classes so the overlay tiers are defined in one place.
  
  ### Modal (opening flicker fix)
  
  - Fixed the modal flickering when opening. The exit-animation flag was reset in a `requestAnimationFrame` callback, so the modal painted one frame with `animate-modal-out` before switching to `animate-modal-in`. Because `modalPopOut` starts at `opacity: 1` while `modalPopIn` starts at `opacity: 0`, the modal flashed fully visible, then disappeared, then faded in again on every re-open. The flag is now reset in the same batch as the mount, so the first painted frame already uses the enter animation.
  
  ### Card
  
  - Standardized the card's extended configuration into nested config/prop pairs with parent-prefixed names — `CardImageConfig` / `CardImageProps` for the embedded image and `CardLinkConfig` / `CardLinkProps` for the embedded link (config types live in `card-config.ts`, prop types extend them in `Card.tsx`). `CardConfig` holds `image: CardImageConfig`; `BaseCardProps` omits `image` from the config and `CardProps` re-adds it as `image?: CardImageProps`, plus `link?: CardLinkProps`.
  - Removed the flat `href`, `linkComponent`, `linkProps`, `imageComponent` and `imageProps` props (removed, not deprecated): `href` performed a full-page `window.location` navigation, which is incompatible with client-side routers. The image part is now `image={{ src, alt, component, props }}` and the link part is `link={{ component: NextLink, props: { href: "/pricing" } }}` (or pass only `props` to render a native `<a>`). Part `props` are spread last, so they take precedence over the component's own props.
  - Link cards keep the native activation behaviour of the element they render (e.g. Enter on an anchor); only button-like cards synthesise Enter/Space clicks.
  - `onClick` and a `link.props.onClick` now both run: the link handler is invoked from the card's own click handler instead of being spread onto the root, so the disabled guard and the card's `onClick` are never bypassed by link props.
  
  ### Button
  
  - Added `href` and `link` (`ButtonLinkProps` — `{ component?, props? }`) so the button can render as a link: when `href` or `link` is provided the root becomes an `<a>`, or `link.component` when given (e.g. `next/link`), instead of `<button>`. `type` and `disabled` are only applied to the `<button>` form — the link form uses `aria-disabled` and the disabled guard still blocks navigation. Link `props` are spread last so they take precedence, and a `link.props.onClick` runs alongside the button's own `onClick`.
  
  ### Image
  
  - Renamed the flat `imageComponent` / `imageProps` props to `component` / `props` (removed, not deprecated) so the Image component's embedded-component props match the nested part shape used by parents (`CardImageProps` exposes the same `component` / `props`).
  
  
  ### Sidebar
  
  - Standardized the sidebar's extended configuration into nested config/prop pairs:
    - `SidebarOptionsConfig` — `radius`, plus `active` (`SidebarActiveOptionConfig`) and `inactive` (`SidebarInactiveOptionConfig`), each carrying `variant` and `color`. `SidebarOptionProps extends SidebarOptionsConfig` and adds the sidebar-local `itemClassName`.
    - `SidebarTooltipConfig` — `show`, `placement`, `variant`, `color`. It carries no instance-only props, so no props type is created for it.
  - `SidebarConfig` now exposes `options?: SidebarOptionsConfig` and `tooltip?: SidebarTooltipConfig`. `BaseSidebarProps` omits `options` from the config and `SidebarProps` re-adds it as `options?: SidebarOptionProps`, plus `tooltip?: SidebarTooltipConfig`.
  - Removed the flat `itemRadius`, `itemVariant`, `activeItemVariant`, `activeItemColor`, `showTooltips`, `tooltipPlacement`, `tooltipVariant`, `tooltipColor` and `itemClassName` props (removed, not deprecated). Migrate e.g. `itemRadius="lg" activeItemColor="danger"` to `options={{ radius: "lg", active: { color: "danger" } }}`, and `showTooltips={false} tooltipPlacement="top"` to `tooltip={{ show: false, placement: "top" }}`.
  - Link handling is now a nested part too: `link?: SidebarLinkProps` (`{ component?, props? }`) replaces the flat `linkComponent` / `linkProps` props (removed, not deprecated) — e.g. `link={{ component: NextLink, props: { prefetch: true } }}`. `anchorProps` remains a flat typed passthrough.
  
  ### Modal / Drawer (slot props)
  
  - Nested the slot class overrides into part objects: `overlay?: { className }` and `content?: { className }` (`ModalOverlayProps` / `ModalContentProps`, `DrawerOverlayProps` / `DrawerContentProps`), replacing the flat `overlayClassName` / `contentClassName` props (removed, not deprecated). The base props now omit the DOM `content` attribute to make room for the `content` part.
  
  ### Select / Autocomplete / MultiSelect / DatePicker
  
  - Standardized the embedded-part types: each part now has a config type in its `*-config.ts` and a props type that extends it with instance-only props in the component file, exposed through the same key (omitted from the config-derived base props):
    - Select: `menu?: MenuProps` (was `MenuConfig`), so `menu.className` is now accepted.
    - MultiSelect: new `MultiSelectChipConfig` + `MultiSelectChipProps` (adds `className`), exposed as `chip?: MultiSelectChipProps`; `chip` is omitted from `MultiSelectConfig` in the base props. Chips now apply `chip.className`. `menu` keeps `MenuProps`.
    - Autocomplete: already used the pair (`menu?: MenuProps`) — uncovered by the standard.
    - DatePicker: `PickerConfig` → `DatePickerPickerConfig`, `PickerProps` → `DatePickerPickerProps` (adds `className`) and `PickerMode` → `DatePickerMode`; exposed as `picker?: DatePickerPickerProps`.
  
  ### Tabs
  
  - Standardized the tab item styling into `TabsOptionsConfig` — `active` (`TabsActiveOptionConfig`) and `inactive` (`TabsInactiveOptionConfig`), each carrying `radius`, `variant` and `color` — with `TabsOptionProps extends TabsOptionsConfig` adding `tabClassName`. `TabsConfig` exposes `options?: TabsOptionsConfig`; `BaseTabsProps` omits it and `TabsProps` re-adds `options?: TabsOptionProps`.
  - Removed the flat `activeRadius`, `activeVariant`, `activeColor` and `tabClassName` props (removed, not deprecated). Migrate `activeColor="danger"` to `options={{ active: { color: "danger" } }}` and `tabClassName="…"` to `options={{ tabClassName: "…" }}`. Inactive tabs are now configurable via `options.inactive`; the defaults preserve the previous `ghost` / `none` / container-radius look.
  
  ### Config resolution (hydration fix)
  
  - Fixed a server/client hydration mismatch where component `className` output differed. `resolveConfig` took a **snapshot** of the component-defaults registry while the provider resolved the config, so any component whose config module registered its defaults *after* that first resolve (common with code-split client chunks and per-route module graphs) fell back to the global defaults on the client while the server used its registered defaults — for example Chip `radius: "full"` registered vs `defaultRadius: "md"`, or the field-based `variant: "bordered"` registered vs `defaultVariant: "solid"`. `config.components` is now resolved lazily, so every access reflects the registry at the moment a component actually renders.

## 0.6.15

### Patch Changes

- update(doc): Remove unwanted section from Readme.md

## 0.6.14

### Patch Changes

- ### asheeui
  
  - Removed the stale top level `style` field from package.json. Style resolution is handled through the `exports` field, and the removed field pointed at a path that does not exist in the published package.
  
  ### Docs
  
  - Removed references to a local playground app that is not part of the published repository.
  - Added a short section to CONTRIBUTING.md explaining how to test local changes by building the package and linking it into a separate project.

## 0.6.13

### Patch Changes

- ### SelectMenu
  
  - Fixed dropdown lag when scrolling with the menu open by adding a `lockScroll` option (now enabled by default) that locks page scroll while the menu is open, using scroll-position-compensated `position: fixed` so the page doesn't jump
  - Fixed visible flash-then-snap on first open by gating the menu's enter animation on Floating UI's `isPositioned` state
  - Replaced manual `react-dom` `createPortal` usage with `@floating-ui/react`'s `FloatingPortal` for consistent focus-trap and nested-floating-element support
  - Extracted the option list into a memoized `SelectMenuOptionsList` component so position and other unrelated re-renders no longer re-create every option button
  - Fixed all toast/menu placements rendering at a single fixed corner by resolving placement per-instance instead of using one shared container (carried over from the Toast fix, applies to menu positioning generally)
  
  ### useSelectFloating
  
  - Set `strategy: "fixed"`, correct for elements portaled to `document.body`
  - Consolidated `useClick`, `useDismiss`, `useRole`, and `useInteractions` into the hook itself, so consumers (Select, and now DatePicker) no longer wire these individually
  - Hook now returns `getReferenceProps`/`getFloatingProps` directly alongside `refs`, `context`, `floatingStyles`, and `isPositioned`
  
  ### Select
  
  - Simplified to use the consolidated interaction props (`getReferenceProps`/`getFloatingProps`) from `useSelectFloating` instead of wiring `useClick`/`useDismiss`/`useRole`/`useInteractions` directly
  - Threaded `isPositioned` and `floatingStyles` through to `SelectMenu` to support the new anti-flash and positioning behavior
  
  ### DatePicker
  
  - Applied the same Floating UI fixes as SelectMenu: `FloatingPortal` in place of manual `createPortal`, `isPositioned`-gated enter animation, and scroll-position-compensated `lockScroll` (now enabled by default via `picker.lockScroll`)
  - Simplified the popover to use the consolidated `getReferenceProps`/`getFloatingProps` from `useSelectFloating` (with `role: "dialog"`) and spread `floatingStyles` on the floating node
  - Memoized the calendar grid (`Calendar`) so position and input re-renders no longer rebuild the month grid

## 0.6.12

### Patch Changes

- Remove unneccesary tests in asheeui

## 0.6.11

### Patch Changes

- ### SelectMenu
  
  - Fixed dropdown lag when scrolling with the menu open by switching Floating UI `strategy` to `"fixed"` and isolating the option list in a memoized `SelectMenuOptionsList`, so scroll-driven position updates no longer rebuild every option `Button` on each re-render
  - Fixed visible "jump then settle" flash on first open by keeping the menu hidden (`invisible opacity-0 pointer-events-none`) and applying the enter animation only once Floating UI's `isPositioned` state is true, so the reveal and the animation start together
  - Replaced manual `react-dom` `createPortal` usage with `@floating-ui/react`'s `FloatingPortal` for consistent focus-trap and nested-floating-element support
  - Added `isPositioned` prop to control initial-render visibility
  
  ### Select
  
  - Threaded `isPositioned` from `useSelectFloating` through to `SelectMenu` to support the new anti-flash behavior
  
  ### MultiSelect
  
  - Threaded `isPositioned` from `useSelectFloating` through to `SelectMenu` to support the new anti-flash behavior
  
  ### Autocomplete
  
  - Threaded `isPositioned` from `useSelectFloating` through to `SelectMenu` to support the new anti-flash behavior
  
  ### DatePicker
  
  - Applied the same Floating UI positioning and portal fixes as SelectMenu: `strategy: "fixed"` and `FloatingPortal` in place of manual `createPortal`
  - Gated the calendar popover's initial visibility and enter animation on Floating UI's `isPositioned` state to prevent a "jump then settle" flash and pop-in on first open
  
  ### Toast
  
  - Replaced manual `react-dom` `createPortal` usage with `@floating-ui/react`'s `FloatingPortal` for consistency with other floating components in the library

## 0.6.10

### Patch Changes

- ### Toast
  
  - Fixed toast placement bug where all toasts rendered at `top-right` regardless of the configured or per-toast `placement`
  - `ToastProvider` now groups active toasts by their resolved placement and renders one positioned container per placement, instead of a single container using the provider-level placement
  - Increased toast container `z-index` (`z-50` → `z-99999`) so toasts render above other portaled components
  - Added `PLACEMENT_CLASSES` to `toast-styles.ts`, mapping each `ToastPlacement` to its fixed-position and alignment classes
  - Added JSDoc comment to `PLACEMENT_CLASSES` documenting its purpose and usage

## 0.6.9

### Patch Changes

- ### Switch
  - Removed error state from Switch
  
  ### Autocomplete
  
  - Added comprehensive JSDoc comments to the Autocomplete component and its configuration file
  - Documented all component props with descriptions and default values
  - Added usage examples for different scenarios
  - Added `@see` references linking to related components
  - Applied consistent commenting style matching the existing Input component
  - Added file-level documentation headers
  - Organized code sections with consistent separator comments
  
  ### DatePicker
  
  - Added comprehensive JSDoc comments to all DatePicker component files
  - Documented all component props with descriptions and default values
  - Added usage examples for different scenarios
  - Added `@see` references linking to related components
  - Applied consistent commenting style matching the existing Input component
  - Added file-level documentation headers to all related files
  - Organized code sections with consistent separator comments
  - Added inline comments for complex logic sections
  
  ### Button
  
  - Added `startContent` and `endContent` props for icon/adornment slots
  - Updated documentation with new props and usage examples
  - Maintained existing behavior for loading states and icon-only mode
  
  ### Select
  
  - Refactored to use Button component as the trigger
  - Added `startContent` and `endContent` support via Input props
  - Extended Input field props (label, description, message, status, etc.)
  - Removed custom button implementation in favor of Button component
  - Updated component to follow DRY philosophy by reusing Input props
  
  ### MultiSelect
  
  - Refactored to use Button component as the trigger
  - Added `startContent` and `endContent` support via Input props
  - Extended Input field props (label, description, message, status, etc.)
  - Removed custom button implementation in favor of Button component
  - Updated component to follow DRY philosophy by reusing Input props
  - Consistent prop structure with Select component
  
  ### Input
  
  - Updated `enableVirtualKeyboard` prop to accept configuration options object
  - Added support for per-field keyboard customization (layout, size, variant, color, radius, portal)
  - Updated `useKeyboardField` usage to pass through keyboard options
  - Updated documentation with new prop type and examples
  
  ### Toast
  
  - Added per-toast styling options (placement, size, variant, radius, animated)
  - Extended `ToastShowOptions` to include styling overrides
  - Added default values to context for consumer access
  - Updated ToastItem to accept and apply per-toast styling
  - Refactored into separate files for better organization (ToastContext, ToastProvider, ToastItem)
  - Improved DRY principles with shared type definitions
  
  ### Keyboard
  
  - Refactored to be hook-controlled (similar to Toast system)
  - Added `disabled` prop for global keyboard disable
  - Added `KeyboardOpenOptions` for per-instance configuration
  - Updated `useKeyboardField` to accept configuration options
  - Auto-renders keyboard via provider (no manual placement needed)
  - Added per-keyboard styling (size, variant, color, radius, portal, layout)
  - Improved DRY principles with shared type definitions
  - Separated into multiple files (KeyboardContext, KeyboardProvider, OnScreenKeyboard)
  
  ## SelectMenu
  
  - Moved z-index from inline style to Tailwind class for better customization
  - Changed default z-index from inline `999999` to Tailwind class `z-100`
  
  # Changeset Summary
  
  ## Card
  
  - Added comprehensive JSDoc comments to Card component and configuration file
  - Documented all component props with descriptions and default values
  - Added usage examples for different scenarios (basic, clickable with image, background image)
  - Added `@see` references linking to related components
  - Applied consistent commenting style matching the existing Input component
  - Added file-level documentation headers
  - Organized code sections with consistent separator comments
  - Added inline comments for complex logic sections
  - Added `CardImageConfig` interface for standardized image configuration
  - Added `CardImageProps` extending config with `src`, `alt`, and custom `component` support
  - Added support for three image positions: `top`, `bottom`, and `background`
  - Added `ratio`, `fit`, and `loading` configuration options for images
  - Implemented background image rendering with absolute positioning
  - Added warning for potential rendering issues with custom image components
  - Fixed Next.js Image component compatibility issues

## 0.6.8

### Patch Changes

- Add lockScroll to the SelectMenu
  Update Modal to fit the whole screen
  Remove the redundant SelectOption type from SelectMenu

## 0.6.7

### Patch Changes

- 09de53d: Revert tooltip changes

## 0.6.6

### Patch Changes

- Fix Accordian overflow issue
  
  - Added `portal?: boolean` to the following component configs and props:
    - `SelectConfig` / `SelectProps`
    - `MultiSelectConfig` / `MultiSelectProps`
    - `AutocompleteConfig` / `AutocompleteProps`
    - `DatePickerConfig` / `DatePickerProps`
    - `ToastConfig` / `ToastProviderProps`
    - `TooltipConfig` / `TooltipProps`
    - `KeyboardConfig` / `KeyboardProviderProps` / `OnScreenKeyboardProps`
  
  - Added `portalTarget?: HTMLElement | null` to the following component configs and props:
    - `SelectConfig` / `SelectProps`
    - `MultiSelectConfig` / `MultiSelectProps`
    - `AutocompleteConfig` / `AutocompleteProps`
    - `DatePickerConfig` / `DatePickerProps`
    - `ToastProviderProps`
    - `SelectMenuProps` (direct prop only)
  
  - All relevant default configs and fallbacks now include `portal: true` and `portalTarget: null`.
  
  - New shared hook for Floating UI positioning used by Select, MultiSelect, Autocomplete, and DatePicker.
  
  - `Select` Now uses `useSelectFloating` hook and passes portal props to `SelectMenu`.
  
  - `MultiSelect` Now uses `useSelectFloating` hook and passes portal props to `SelectMenu`.
  
  - `Autocomplete` Now uses `useSelectFloating` hook and passes portal props to `SelectMenu`.
  
  - `DatePicker` Now uses `useSelectFloating` hook and conditionally renders popover content via `createPortal`.
  
  - `ToastProvider` Now conditionally renders toast container via `createPortal` based on `portal` prop.
  
  - `Tooltip` Now conditionally renders tooltip content via `FloatingPortal` based on `portal` prop.
  
  - `OnScreenKeyboard` Now conditionally renders keyboard via `FloatingPortal` based on `portal` prop.
  
  - `SelectMenu` Now accepts `portal` and `portalTarget` props and conditionally renders via `createPortal`.
  
  - Fixed consistent portal behavior All floating components now handle portal rendering consistently, with proper cascade resolution (prop > component config > fallback).
  
  - Fixed portal target resolution All components now resolve portal targets with proper fallback to `document.body` when available.
  
  - Fixed z-index consistency Updated z-index values across floating components to ensure proper stacking (z-50 for toasts, z-9999 for keyboard and select menus, z-999999 for date picker popovers).
  
  - Added TSDoc comments All new `portal` and `portalTarget` props are fully documented with explanations of when and why to use them.
  
  - Added component doc comments Updated component-level documentation to explain portal behavior and benefits.
  
  - Added examples JSDoc examples now show portal usage where relevant.
  
  
  -  Added `size?: KeyboardSizeKey` to `KeyboardConfig`, `KeyboardProviderProps`, and `OnScreenKeyboardProps`
    - `KeyboardSizeKey` is an alias for `Size` (`"sm" | "md" | "lg"`)
    - Default value is `"md"`
    - Follows the standard AsheeUI cascade: prop > component config > fallback
  
  - Fix ResizableScreen handle visibility when parent sizes are "auto". Use flexbox `self-stretch` for the separator and inner handle instead of
    percentage `h-full`/`w-full`, which can collapse when ancestor heights are
    not definite.
  - Remove the `ResizeObserver` based measurement and rely on CSS fallbacks
    (`minHeight` / `minWidth`) so the handle appears correctly even when
    children provide the container size.

## 0.6.5

### Patch Changes

- Fix wrong menu type in Autocomplete from SelectConfig to SelectMenuConfig

## 0.6.4

### Patch Changes

- Fix wronk menu type in Autocomplete from SelectConfig to SelectMenuConfig

## 0.6.3

### Patch Changes

- Standardize component configuration and token resolution across the core
  `asheeui` package: components inherit their tokens from shared `*Config`
  types, dropdown menus are wired through the unified `SelectMenu` API, and
  solid-variant foreground colors are unified for dark-theme contrast.
  
  Add new shared `SelectMenuConfig`: added `select-menu-config.ts` with
    `menuVariant`, `color`, `radius`, and `size` tokens plus
    `FALLBACK_SELECT_MENU_CONFIG`, exported from the select-menu barrel.
  
  CMake `SelectMenu` resolves its own menu tokens: it now accepts `menuProps`
    and `menuConfig` instead of individual visual props (`variant`, `color`,
    `radius`, `size`) and applies the resolved tokens to the search input and
    option buttons consistently.
  
  Make`Select`, `MultiSelect`, and `Autocomplete` use the unified `SelectMenu`
    API: all three pass `menuProps` + `menuConfig` (no more legacy flat menu
    props on the menu element). `Select` and `MultiSelect` expose a single
    `menu?: SelectMenuConfig` override bag and delegate token resolution to the
    menu, and `Autocomplete` forwards its `menu` config section unchanged.
  
  Add config inheritance across all components component props now
    extend their corresponding config type instead of re
  
  Standardized token-resolution naming: the shared trigger tokens now use
    the canonical `resolvedVariantKey`/`resolvedColorKey`/`resolvedRadiusKey`/
    `resolvedSizeKey` .
  
  Add hover states to sharered variant
  
  Add detailed commenting and documentation

## 0.6.2

### Patch Changes

- Fix Sidebar default inactive item color

## 0.6.1

### Patch Changes

- Fix AsheeUIProvider name change
  Add vitest tests to asheeui

## 0.6.0

### Minor Changes

- Refactor the monorepo architecture to remove the framework-specific plugins
  (`@asheeui/next`, `@asheeui/vite`) and the standalone utilities package
  (`@asheeui/utils`), moving to a clean, framework-agnostic setup.
  
  **Highlights**
  
  - **Removed bundler plugins** — `@asheeui/next` (`withAsheeUI`) and
    `@asheeui/vite` (`asheeui()`) are gone from the workspace. Runtime config is
    no longer injected through `virtual:ashee-config` build shims, so apps no
    longer need to modify `next.config.*`, `vite.config.*`, or `app.config.*` to
    use AsheeUI.
  
  - **Consolidated shared utilities** — `cn`, `mergeObject`, and `DeepPartial`
    now live inside core `asheeui` and are exported from the package root (and
    the `asheeui/utils` entry point). Projects that depended on `@asheeui/utils`
    should switch to `asheeui` directly.
  
  - **Added `AsheeUIProvider` and `useAshee`** — runtime theme and component
    configuration is now managed explicitly through React Context. Wrap your app
    once and pass your config object:
  
    ```tsx
    import { AsheeUIProvider } from "asheeui";
    import config from "./asheeui.config";
  
    <AsheeUIProvider config={config}>{children}</AsheeUIProvider>;
    ```
  
  - **Updated `@asheeui/cli`** — init/doctor/fix templates no longer install or
    wire up the removed plugin packages. Projects are scaffolded with the
    plugin-free setup and their app roots are wrapped with
    `<AsheeUIProvider config={config}>`.
  
  **Migration notes**
  
  - Remove `@asheeui/next`, `@asheeui/vite`, and `@asheeui/utils` from your
    `package.json` and bundler configs.
  - Replace `<AsheeUIProvider>` with `<AsheeUIProvider config={...}>` at your app
    root (passing the object from your `asheeui.config.*` file), or let
    `npx asheeui init` / `npx asheeui fix` rewire the provider for you.

## 0.5.0

### Minor Changes

- docs: add standardized JSDoc annotations and complete component documentation

### Patch Changes

- Updated dependencies
  - @asheeui/utils@0.3.0

## 0.4.8

### Patch Changes

- Fix Card component image positioning and border radius issues.
  
  - **Top/bottom image radius**: Top images now correctly show no radius on bottom corners, and bottom images show no radius on top corners.
  
  - **Background image rendering**: Background images are now rendered directly in an absolutely positioned container with `inset-0` and `z-0`, ensuring they properly fill the entire card behind the content without affecting layout or causing visual artifacts.

## 0.4.7

### Patch Changes

- Fix `Image` component reliability issues and add custom image component support (e.g. `next/image`) to `Image` and `Card`.
  
  **New:**
  - `Image` and `Card` now accept `imageComponent` (an `ElementType` to render instead of the native `<img>` tag) and `imageProps` (extra props forwarded to it).
  - When `imageComponent` is set and no `width`/`height`/`fill` is supplied via `imageProps`, `Image` automatically applies `fill: true` and a default `sizes="100%"`, since the component is container/ratio driven rather than intrinsic-size driven.
  - Dev-only console warnings guide consumers when a custom image component is missing explicit sizing, or when `src` is empty/undefined (custom components like `next/image` throw synchronously on an invalid `src` rather than firing `onError`).
  
  **Fixed:**
  - Skeleton no longer gets stuck indefinitely on load. Previously, `onLoad`/`onError` compared the browser-normalized `e.currentTarget.src` against internal state, which never matches for relative URLs — causing `isLoaded` to never flip to `true`. The rendered image element is now `key`-ed on `currentSrc` instead, so a stale event from a superseded `src` can't affect the current element, and load/error handling no longer relies on URL string comparison.
  - Skeleton no longer inherits the image's opacity/transition classes, which previously could make the skeleton itself invisible while `isLoaded` was `false`.
  - Cached images (where the browser marks `<img>` as `complete` before React attaches listeners) are now detected on mount, so `isLoaded` resolves correctly instead of leaving the skeleton visible for an already-loaded image.
  - `fallbackSrc` is now validated as a non-empty string before use, preventing a second failure when `fallbackSrc` itself is empty.
  - `Image` no longer crashes when passed a custom image component (e.g. `next/image`) with an empty or undefined `src` — rendering is skipped and the skeleton stays visible until a valid `src` is provided, instead of throwing "Expected a non-empty string" during render.
  - Fixed a React warning ("props object containing a key prop is being spread into JSX") by passing `key` as a literal JSX attribute on `ImageComponent` rather than including it in the spread props object.
  - `Card`'s `imageComponent`/`imageProps` are now forwarded to its internal `Image` for all three image positions (`top`, `bottom`, `background`).

## 0.4.6

### Patch Changes

- Change imageComponent and linkComponent type to `React.ElementType` to support components with differing prop signatures.

## 0.4.5

### Patch Changes

- Add `linkComponent` and `linkProps` props to Sidebar component to allow using framework-specific link components (e.g., Next.js Link, TanStack Router Link) while preserving all styles and interactions.
  Add `linkComponent` and `linkProps` props to Link component to replace the native `<a>` with custom routing components.
  Add `imageComponent` and `imageProps` props to Image component to use custom image components (e.g., Next.js Image) while keeping skeleton, fallback, and styling behaviors.

## 0.4.4

### Patch Changes

- Remove image possition left and right from Card component

## 0.4.3

### Patch Changes

- Fix Image component infinite loading issue
  Add Card component

## 0.4.2

### Patch Changes

- Remove radius from Drawer component
  Remove size xl
  Centralize Size, Radius, Color and Variant types in component configs with component-specific aliases
  Add UnderlineRadius helper and enforce radius none when variant is underlined
  Fix layout gap in `bordered`, `separated`, and `ghost` Accordion variants by removing redundant `overflow-clip` clipping on item containers.
  Add customizable on and off icons to PasswordInput componenet
  Fix overlay and content color missing in Modal component
  Redesigned resize handle and fixed dragging lag in ResizableScreen component
  Add collapsible controls, collapse button visibility, default collapsed state, omit full radius, and fix icon centering in collapsed mode to the SIdebar component

## 0.4.1

### Patch Changes

- Remove Card component
  Remove tailwind classes card and muted
  Fix underline radius issues on components
  Update Sidebar component to have sections
  Update all Input components varients to default to the boarderd varient
  Fix micro bugs

## 0.4.0

### Minor Changes

- Remove all tokens including typogarphy, spacing, size and shadow
  Remove container, flex, grid, heading and text components
  Restructure config
  Update all components with the changes
  Remove framer motion

## 0.3.13

### Patch Changes

- Remove defaults from container component

## 0.3.12

### Patch Changes

- Add height to container
  Remove unnessesary defaults from components

## 0.3.11

### Patch Changes

- Fix theme not switching bug

## 0.3.10

### Patch Changes

- Fix Card component prop
- Updated dependencies
  - @asheeui/utils@0.2.7

## 0.3.9

### Patch Changes

- Fix theme/space relative path issue

## 0.3.8

### Patch Changes

- Add toggleTheme to ui

## 0.3.7

### Patch Changes

- Fix npm package export issues
- Updated dependencies
  - @asheeui/utils@0.2.6

## 0.3.6

### Patch Changes

- Fix React Server Component (RSC) boundary by adding the `"use client"` directive to the package entry point and a Rollup output `banner` so every emitted JS file carries the client directive.

## 0.3.5

### Patch Changes

- Fix ESM subpath export mappings and per-component build output structure.
  - Update `build-registry.ts` to map `./<component>` subpath exports to per-component runtime ESM files (`./dist/components/<name>/index.js`) instead of bundling everything into root `dist/index.js`.
  - Configure `vite.config.ts` to output single ESM target format (`formats: ["es"]`) with `preserveModules: true` and `preserveModulesRoot: "src"`.
  - Implement automated barrel generation plugin (`generateBarrels`) to restore per-directory `index.js` re-exports in `dist/`.
  - Export all 33 component modules from `src/index.ts`.
- Updated dependencies
  - @asheeui/utils@0.2.5

## 0.3.4

### Patch Changes

- Fix(build): align export maps, type declarations, and build targets across packages
  
  - Correct package.json exports, types, and publishConfig fields across all packages to point to actual dist/ build outputs (.mjs, .cjs, .d.mts, .d.cts)
  - Fix @asheeui/utils ESM import condition to point to dist/index.mjs, resolving Rolldown import resolution failure in start-playground
  - Configure @asheeui/cli as ESM-only package with dist/index.mjs and dist/index.d.mts targets
  - Correct publishConfig.module and publishConfig.types across @asheeui/next and @asheeui/vite
  - Set packages/ui/tsconfig.json rootDir to ./src to output per-component .d.ts declarations directly under dist/
  - Add copyStyles plugin and entryRoot configuration to packages/ui/vite.config.ts to emit dist/index.css and dist/index.js
  - Update build-registry.ts to generate publishConfig.exports matching actual emitted module and type files
- Updated dependencies
  - @asheeui/utils@0.2.4

## 0.3.3

### Patch Changes

- Update package.json types export
- Updated dependencies
  - @asheeui/utils@0.2.3

## 0.3.2

### Patch Changes

- Update package.json exports
- Updated dependencies
  - @asheeui/utils@0.2.2

## 0.3.1

### Patch Changes

- Fix build with utils package
- Updated dependencies
  - @asheeui/utils@0.2.1

## 0.3.0

### Minor Changes

- Fix build configs

### Patch Changes

- Updated dependencies
  - @asheeui/utils@0.2.0

## 0.2.1

### Patch Changes

- Fixed undefined behavior on missing custom theme values

## 0.2.0

### Minor Changes

- Improved integration with multiple react frameworks and Add cli
