import type {
  KeyboardConfig,
  KeyboardLayouts,
  KeyDisplayMap,
} from "./keyboard-config";

export const defaultKeyboardLayouts: KeyboardLayouts = {
  default: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "q w e r t y u i o p",
    "a s d f g h j k l",
    "{shift} z x c v b n m {shift}",
    "{symbols} , {space} . {enter}",
  ],
  shift: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "Q W E R T Y U I O P",
    "A S D F G H J K L",
    "{shift} Z X C V B N M {shift}",
    "{symbols} , {space} . {enter}",
  ],
  symbols: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "@ # $ _ & - + ( )",
    "* \" ' : ; ! ? %",
    "{abc} / \\ ~ ` = {abc}",
    "{abc} , {space} . {enter}",
  ],
  numeric: ["1 2 3 {bksp}", "4 5 6 {clear}", "7 8 9 {enter}", "0 . {space}"],
};

export const defaultKeyDisplay: KeyDisplayMap = {
  "{bksp}": "⌫",
  "{enter}": "↵",
  "{shift}": "⇧",
  "{symbols}": "?123",
  "{abc}": "ABC",
  "{space}": "space",
  "{clear}": "C",
};

export const defaultKeyboardConfig: KeyboardConfig = {
  layouts: defaultKeyboardLayouts,
  display: defaultKeyDisplay,
  defaultLayout: "default",
  heightClass: "h-[40vh] min-h-[18.75rem]",
  autoShiftBack: true,
};
