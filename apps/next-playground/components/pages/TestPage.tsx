import { Link as AsheeLink } from "asheeui";
import NextLink from "next/link";

export default function TestPage() {
  return (
    <AsheeLink
      href="/dashboard"
      linkComponent={NextLink}
      linkProps={{ prefetch: true }}
      variant="default"
      color="primary"
      size="md"
      underline="hover">
      Dashboard
    </AsheeLink>
  );
}
