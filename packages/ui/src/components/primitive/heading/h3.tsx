import { Heading, type HeadingProps } from "./heading";

export function H3(props: Omit<HeadingProps, "level">) {
  return <Heading level={3} {...props} />;
}
