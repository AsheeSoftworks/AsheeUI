import { Heading, type HeadingProps } from "./heading";

export function H4(props: Omit<HeadingProps, "level">) {
  return <Heading level={4} {...props} />;
}
