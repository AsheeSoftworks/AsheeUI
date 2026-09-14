---
"asheeui": minor
---

Conform the interactive components to the accessibility baseline.

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
