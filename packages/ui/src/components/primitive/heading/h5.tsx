import { Heading, type HeadingProps } from "./heading";

export function H5(props: Omit<HeadingProps, "level">) {
  return <Heading level={5} {...props} />;
}
