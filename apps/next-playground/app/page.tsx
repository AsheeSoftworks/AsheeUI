"use client";

import { Button, Container, Heading, useTheme } from "asheeui";

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
