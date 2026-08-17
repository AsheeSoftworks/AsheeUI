"use client";

import { useTheme } from "@ashee/theme";
import { Button, Container, Heading } from "@ashee/ui";

const Page = () => {
  const { setTheme } = useTheme();
  return (
    <Container>
      <Heading level={1}>HI</Heading>
      <Button
        onClick={() => {
          setTheme("light");
          // alert(theme);
        }}>
        Click
      </Button>
    </Container>
  );
};

export default Page;
