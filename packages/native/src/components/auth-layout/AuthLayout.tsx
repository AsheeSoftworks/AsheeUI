/**
 * AuthLayout component for the native package.
 *
 * The component satisfies the framework's auth-layout contract: the shell of an authentication
 * route, holding a brand, a heading, the form the consumer passes, an optional footer slot and
 * optional product media, with a panel treatment, an alignment and a measure that resolve
 * through the configuration cascade. It carries no authentication logic of any kind: what the
 * reader submits comes from the consumer.
 *
 * What the platform states differently is what it has to give the form. The web statement is a
 * document that grows with what it holds and scrolls as a whole, so its shell is a full-height
 * column and a form shorter than the window is centred in it. A native screen is given its
 * height by the platform, so the shell is what fills that height and the form is centred in it
 * the same way — nothing here scrolls, because the keyboard and the reading order of a platform
 * screen are the screen's own business.
 *
 * The media column is the one arrangement the platform decides in the render pass rather than in
 * a stylesheet. The web says `lg` as a variant prefix and lets the browser reflow; the platform
 * has no media query, so `useBreakpoint` answers once and the two regions either sit beside each
 * other or stay stacked in the order the side they were given puts them, which is the order the
 * web's own flow gives them at its narrow widths.
 */

import {
  NATIVE_AUTH_CONTENT_SIZE_CLASS,
  NATIVE_AUTH_FOOTER_CLASS,
  NATIVE_AUTH_FORM_COLUMN_CENTERED_CLASS,
  NATIVE_AUTH_FORM_COLUMN_CLASS,
  NATIVE_AUTH_FORM_WRAPPER_CLASS,
  NATIVE_AUTH_LAYOUT_CLASS,
  NATIVE_AUTH_LAYOUT_SPLIT_CLASS,
  NATIVE_AUTH_MEDIA_COLUMN_CLASS,
  NATIVE_AUTH_PANEL_CLASS,
  NATIVE_AUTH_PANEL_PADDING_CLASS,
  resolveConfigCascade,
} from "@asheeui/core";
import type { ReactNode } from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import { View } from "react-native";
import { useBreakpoint } from "../../hooks/use-breakpoint";
import { useAsheeNativeConfig } from "../../provider/AsheeNativeProvider";
import { classNames } from "../../utils/class-names";
import { SectionHeading } from "../section-kit/SectionHeading";
import {
  FALLBACK_NATIVE_AUTH_LAYOUT_CONFIG,
  type NativeAuthLayoutConfig,
} from "./auth-layout-config";

/**
 * Props for the native AuthLayout.
 */
export interface AuthLayoutProps
  extends NativeAuthLayoutConfig,
    Omit<ViewProps, "children" | "style"> {
  /** Brand content above the heading, typically a logo and product name. */
  brand?: ReactNode;

  /** The heading of the page, for example "Sign in". */
  title?: ReactNode;

  /** Supporting sentence under the heading. */
  description?: ReactNode;

  /** The form itself. */
  children: ReactNode;

  /**
   * Content under the form, typically the link to the other route.
   * It is rendered inside the panel, under the form.
   */
  footer?: ReactNode;

  /**
   * Product media, such as a screenshot.
   * It sits on the side it is given: beside the form once the window is wide enough, and in
   * the flow of the page otherwise.
   */
  media?: ReactNode;

  /** Extra classes appended last, so a consumer's own classes win. */
  className?: string;

  /** Platform styles, for what NativeWind cannot express. */
  style?: StyleProp<ViewStyle>;
}

/**
 * The shell of an authentication page.
 *
 * The shell gives an authentication route the structure its content assumes: the form is
 * centred in the height the platform gave the screen, it keeps a readable measure, it
 * optionally sits on a panel, and it has somewhere for the brand, the heading and the link to
 * the other route.
 *
 * @param props - The shell's options and the platform's view props.
 * @param props.children - The form.
 * @param props.brand - Brand content above the heading.
 * @param props.title - The heading of the page.
 * @param props.description - Supporting sentence under the heading.
 * @param props.footer - Content under the form.
 * @param props.media - Product media.
 * @param props.panel - Draw the form on a panel. Defaults to true.
 * @param props.align - Vertical alignment of the form column. Defaults to "center".
 * @param props.mediaPosition - Side the media column sits on. Defaults to "end".
 * @param props.contentSize - Maximum width of the form column. Defaults to "sm".
 * @param props.className - Extra classes applied last.
 * @returns The rendered shell.
 *
 * @example
 * ```tsx
 * <AuthLayout
 *   brand={<Text role="label">Ashee SMS</Text>}
 *   title="Sign in"
 *   description="Use the email address your workspace knows."
 *   footer={<Link href="/reset">Forgot your password?</Link>}>
 *   <Form onSubmit={signIn}>
 *     <Input label="Email" name="email" />
 *     <Button onPress={submit}>Sign in</Button>
 *   </Form>
 * </AuthLayout>
 * ```
 *
 * @see Page - The shell for an authenticated page.
 */
export function AuthLayout({
  brand,
  title,
  description,
  footer,
  media,
  panel,
  align,
  mediaPosition,
  contentSize,
  className,
  style,
  children,
  ...rest
}: AuthLayoutProps) {
  const config = useAsheeNativeConfig();
  const { isAtLeast } = useBreakpoint();

  const resolved = resolveConfigCascade<
    NativeAuthLayoutConfig,
    Required<NativeAuthLayoutConfig>
  >(
    { panel, align, mediaPosition, contentSize },
    config.components.authlayout,
    FALLBACK_NATIVE_AUTH_LAYOUT_CONFIG,
  );

  // The web states the two-column arrangement at `lg`, so the platform reads the same width.
  const sideBySide = Boolean(media) && isAtLeast("lg");

  const mediaColumn = Boolean(media) && (
    // The region carries an identifier so a reader of the tree (and a test) can tell the two
    // arrangements apart; the shell has no landmark names of its own to lean on.
    <View testID="auth-layout-media" className={NATIVE_AUTH_MEDIA_COLUMN_CLASS}>
      {media}
    </View>
  );

  const formColumn = (
    <View
      testID="auth-layout-form"
      className={classNames(
        NATIVE_AUTH_FORM_COLUMN_CLASS,
        resolved.align === "center" && NATIVE_AUTH_FORM_COLUMN_CENTERED_CLASS,
      )}>
      <View
        className={classNames(
          NATIVE_AUTH_FORM_WRAPPER_CLASS,
          NATIVE_AUTH_CONTENT_SIZE_CLASS[resolved.contentSize],
          resolved.panel && NATIVE_AUTH_PANEL_CLASS,
          resolved.panel && NATIVE_AUTH_PANEL_PADDING_CLASS,
        )}>
        {brand}

        <SectionHeading
          title={title}
          description={description}
          align="center"
          size="lg"
        />

        {children}

        {footer && <View className={NATIVE_AUTH_FOOTER_CLASS}>{footer}</View>}
      </View>
    </View>
  );

  return (
    <View
      className={classNames(
        NATIVE_AUTH_LAYOUT_CLASS,
        sideBySide && NATIVE_AUTH_LAYOUT_SPLIT_CLASS,
        className,
      )}
      style={style}
      {...rest}>
      {resolved.mediaPosition === "start" && mediaColumn}

      {formColumn}

      {resolved.mediaPosition === "end" && mediaColumn}
    </View>
  );
}
