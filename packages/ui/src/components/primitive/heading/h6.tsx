import { Heading, type HeadingProps } from "./heading";

export function H6(props: Omit<HeadingProps, "level">) {
  return <Heading level={6} {...props} />;
}
