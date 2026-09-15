/**
 * AuthLayout component for AsheeUI.
 *
 * This file provides the `AuthLayout` page shell: a centred form column with an
 * optional media column beside it, a brand slot, a heading and a footer slot for
 * the link between authentication routes. It carries no authentication logic of
 * any kind: a consumer passes its own form as children and its own messages as
 * props.
 */

"use client";

import {
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useAsheeConfig } from "../../libs/context";
import { cn } from "../../utils";
import { resolveConfigCascade } from "../../utils/resolve-token";
import { SectionHeading } from "../section-kit/SectionHeading";
import {
  type AuthLayoutConfig,
  FALLBACK_AUTH_LAYOUT_CONFIG,
} from "./auth-layout-config";
import {
  AUTH_CONTENT_SIZE_CLASS,
  AUTH_FOOTER_CLASS,
  AUTH_FORM_COLUMN_CENTERED_CLASS,
  AUTH_FORM_COLUMN_CLASS,
  AUTH_FORM_WRAPPER_CLASS,
  AUTH_LAYOUT_CLASS,
  AUTH_MEDIA_COLUMN_CLASS,
  AUTH_MEDIA_FIRST_CLASS,
  AUTH_PANEL_CLASS,
  AUTH_PANEL_PADDING_CLASS,
} from "./auth-layout-styles";

type BaseAuthLayoutProps = AuthLayoutConfig &
  Omit<HTMLAttributes<HTMLDivElement>, "color" | "title">;

/**
 * Props for the AuthLayout component.
 */
export interface AuthLayoutProps extends BaseAuthLayoutProps {
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
   * Product media beside the form from the `lg` breakpoint upwards, such as a
   * screenshot. On a narrow screen the media stacks above the form.
   */
  media?: ReactNode;

  /**
   * Element to render the shell as.
   * Defaults to a `div`.
   *
   * @default "div"
   */
  as?: ElementType;
}

/**
 * The shell of an authentication page.
 *
 * AuthLayout gives an authentication route the structure its content assumes: the
 * form is vertically centred, it has a readable measure, it optionally sits on a
 * panel, and it has somewhere to put the brand, the heading and the link to the
 * other route. Everything the reader submits comes from the consumer, so no
 * authentication behaviour lives in the framework.
 *
 * @param props - AuthLayout configuration options and element attributes.
 * @param props.children - The form.
 * @param props.brand - Brand content above the heading.
 * @param props.title - The heading of the page.
 * @param props.description - Supporting sentence under the heading.
 * @param props.footer - Content under the form.
 * @param props.media - Product media beside the form.
 * @param props.panel - Draw the form on a panel. Defaults to true.
 * @param props.align - Vertical alignment of the form column. Defaults to
 * "center".
 * @param props.mediaPosition - Side of the media column. Defaults to "end".
 * @param props.contentSize - Maximum width of the form column. Defaults to
 * "sm".
 * @param props.as - Element to render. Defaults to "div".
 * @returns The rendered shell.
 *
 * @example
 * ```tsx
 * <AuthLayout
 *   brand="Ashee SMS"
 *   title="Sign in"
 *   description="Use the email address your workspace knows."
 *   footer={<Link href="/reset">Forgot your password?</Link>}
 *   media={<Image src="/inbox.png" alt="" ratio="video" />}
 * >
 *   <Form onSubmit={signIn}>
 *     <Input label="Email" type="email" name="email" required />
 *     <Button type="submit" fullWidth>Sign in</Button>
 *   </Form>
 * </AuthLayout>
 * ```
 *
 * @see Page - The shell for an authenticated page.
 */
export const AuthLayout = forwardRef<HTMLDivElement, AuthLayoutProps>(
  (
    {
      brand,
      title,
      description,
      footer,
      media,
      panel,
      align,
      mediaPosition,
      contentSize,
      as,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const config = useAsheeConfig();

    const resolved = resolveConfigCascade<
      AuthLayoutConfig,
      Required<AuthLayoutConfig>
    >(
      { panel, align, mediaPosition, contentSize },
      config.components?.authlayout,
      FALLBACK_AUTH_LAYOUT_CONFIG,
    );

    const hasMedia = Boolean(media);
    const Component: ElementType = as ?? "div";

    const mediaColumn = hasMedia && (
      <div
        className={cn(
          AUTH_MEDIA_COLUMN_CLASS,
          resolved.mediaPosition === "start" && AUTH_MEDIA_FIRST_CLASS,
        )}>
        {media}
      </div>
    );

    return (
      <Component
        ref={ref}
        className={cn(
          AUTH_LAYOUT_CLASS,
          hasMedia && "lg:grid-cols-2",
          className,
        )}
        {...rest}>
        {resolved.mediaPosition === "start" && mediaColumn}

        <div
          className={cn(
            AUTH_FORM_COLUMN_CLASS,
            resolved.align === "center" && AUTH_FORM_COLUMN_CENTERED_CLASS,
          )}>
          <div
            className={cn(
              AUTH_FORM_WRAPPER_CLASS,
              AUTH_CONTENT_SIZE_CLASS[resolved.contentSize],
              resolved.panel && AUTH_PANEL_CLASS,
              resolved.panel && AUTH_PANEL_PADDING_CLASS,
            )}>
            {brand}
            <SectionHeading
              title={title}
              description={description}
              align="center"
              size="lg"
            />
            {children}
            {footer && <div className={AUTH_FOOTER_CLASS}>{footer}</div>}
          </div>
        </div>

        {resolved.mediaPosition === "end" && mediaColumn}
      </Component>
    );
  },
);

AuthLayout.displayName = "AuthLayout";
