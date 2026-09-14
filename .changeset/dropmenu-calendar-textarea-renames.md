---
"asheeui": minor
---

Rename `Select` to `Dropmenu`, `DatePicker` to `Calendar`, and `TextArea` to `Textarea`.

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