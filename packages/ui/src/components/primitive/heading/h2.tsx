import { Heading, type HeadingProps } from "./heading";

export function H2(props: Omit<HeadingProps, "level">) {
  return <Heading level={2} {...props} />;
}
