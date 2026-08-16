"use client";

import { Button, Container, Heading } from "@ashee/ui";

const page = () => {
  return (
    <Container>
      <Heading level={1}>HI</Heading>
      <Button
        onClick={() => {
          alert("Clicked");
        }}>
        Click
      </Button>
    </Container>
  );
};

export default page;
