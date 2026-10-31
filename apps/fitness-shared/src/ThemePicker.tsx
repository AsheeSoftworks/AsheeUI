/**
 * The header's theme picker.
 *
 * A single control both shells can mount, so the web navbar and the device header offer the same
 * colour switcher. It is the theme package's card variant: each choice shows its palette, not just
 * its name.
 */
import { ThemeSwitcher } from "@asheeui/theme";
import {
  Modal,
  Typography,
  VStack,
} from "asheeui";

export interface ThemePickerProps {
  /** Whether the layer is open. */
  isOpen: boolean;

  /** Close the layer. */
  onClose(): void;
}

/**
 * A modal containing the theme cards.
 *
 * @param props - The open state and its close handler.
 */
export function ThemePicker({ isOpen, onClose }: ThemePickerProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <VStack gap="md">
        <Typography role="heading-md">Choose a theme</Typography>
        <Typography role="body-sm" tone="muted">
          The choice is stored by the platform. Every palette is also available in Settings.
        </Typography>
        <ThemeSwitcher
          variant="cards"
          showSystem
          onValueChange={onClose}
        />
      </VStack>
    </Modal>
  );
}
