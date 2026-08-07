import { Heading, type HeadingProps } from "./heading";

export function H1(props: Omit<HeadingProps, "level">) {
  return <Heading level={1} {...props} />;
}
