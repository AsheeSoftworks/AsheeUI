# Migration and deprecation policy

## The policy in force from 1.0

From 1.0 onward, AsheeUI follows semantic versioning for its public API, and a
breaking change follows the process below rather than arriving unannounced.

| Step | What happens |
| --- | --- |
| Deprecation | The API keeps working and carries a deprecation notice that names its replacement and appears in the changelog and in the editor |
| Window | A deprecated API stays for **at least one minor release**, so a consumer always has a release to migrate in |
| Removal | Removal happens only in a **major release**, and the release notes list every removed API with its replacement |
| Documentation | Every deprecation and every removal is described here, in this file |

Bug fixes, internal refactoring, non-breaking additions and behavioural
corrections are not breaking changes and follow the ordinary release flow. A
behavioural correction that a consumer could depend on is called out in the
release notes.

## What counts as the public API

| Included | Not included |
| --- | --- |
| Everything exported from `asheeui` | Internal modules and helpers |
| Props, types and component names | DOM structure that is not documented |
| The configuration keys and their defaults | Class names the framework applies |
| The CLI's commands, flags and exit codes | The CLI's console output |

## Breaking changes before 1.0

`0.8.0` was versioned internally but never published, and the `0.9.x` release stage
the plan described was folded into `1.0.0`, so a consumer on the previous release
upgrades from `0.7.0` straight to `1.0.0`. The
[1.0.0 upgrade guide](./release-1.0.0.md) is the complete picture of that jump;
the tables below are the per-version record.

The 0.x releases stabilized the API, and each breaking change arrived with the
migration it needed. They are listed here so an upgrade from an earlier release
is a documentation exercise rather than an investigation.

### `0.8.0`

| Change | Migration |
| --- | --- |
| `Select` renamed to `Dropmenu` | Rename the import, the element and the props type |
| `DatePicker` renamed to `Calendar` | Rename the import, the element and the props type |
| `TextArea` renamed to `Textarea` | Rename the import, the element and the props type |
| Renamed configuration sections: `components.select`, `components.datePicker` | Use `components.dropmenu` and `components.calendar` |
| Built-in defaults changed to a boxy radius and a faded fill (`defaultRadius: "xs"`, `defaultVariant: "faded"`) | Pass the previous values in your configuration if you prefer the old look |
| The substitution API unified on `component` and `componentProps` | Rename `linkComponent`/`linkProps` on `Link`, `props` on `Image`, `imageProps` on `Avatar`, and the same keys on a `Breadcrumb` step and in the `Card` image and link configuration. `Form` gained the pair. |
| Internal helpers removed from the package root: `getInitials`, `getPaginationRange`, `RadioContext`, `RadioContextValue`, `useRadioGroupContext` | Stop importing them; the components use them internally |

### `1.0.0`

No public API was removed to reach 1.0. The API that ships with 1.0 is the
frozen surface: from here on, the policy above applies.

### `1.1.0`

No public API changed. This release is additive:

| Addition | Notes |
| --- | --- |
| 17 components across the layout, pattern, page and utility layers | New exports; every existing import keeps working |
| New configuration sections (`container`, `section`, `stack`, `grid`, `page`, `sidebarLayout`, `authLayout`, `hero`, `cta`, `featureGrid`, `testimonials`, `pricingCard`, `navbar`, `footer`, `emptyState`, `pinInput`, `clipboard`) | New keys; an existing configuration needs no change |
| The `asheeui/puck` entry point | New subpath export, and `@puckeditor/core` is an optional peer dependency, so it is only installed when the integration is imported |
| A shared spacing scale (`Space` and its class maps) | New exports |
| `resolveConfigCascade` | New utility export; `resolveCascade` is unchanged |

Two behavioural notes, neither of which changes an existing component:

- `PinInput` reports a dense code: deleting a character in the middle moves the
  characters after it left, and a paste into a box beyond the filled characters
  lands at the end of them. Both are documented in the component's own doc
  comments.
- `EmptyState` carries no live-region role by default. A consumer that renders it
  in response to an asynchronous result passes `role="status"` or `role="alert"`.

## Upgrading

1. Read the entry for your target version in this file and the package changelog.
2. Apply the migrations.
3. Run your test suite.
4. If the change involved the stylesheet import, the provider or the
   configuration keys, run `npx asheeui doctor` to confirm the setup.

## Reporting a problem with this policy

If a documented migration does not work, or a change arrived without the
migration it needed, open an issue. That is treated as a defect in the release,
not as a documentation gap.
