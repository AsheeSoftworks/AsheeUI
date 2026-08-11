import {
  Accordion,
  Card,
  Carousel,
  Chip,
  Container,
  Heading,
  Image,
  Link,
  Parallax,
} from "@ashee/ui";

export default function ConfigTestPage() {
  return (
    <main className="max-w-4xl mx-auto p-8 space-y-12">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold">
          Playground: Config-Driven Defaults
        </h1>
        <p className="text-muted-foreground">
          Testing components using system context/defaults without local prop
          overrides.
        </p>
      </header>

      {/* Chip */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Chip (Config)
        </Heading>
        <Container className="flex gap-2">
          <Chip animation={"none"}>Default Chip</Chip>
          <Chip>Configured Style</Chip>
        </Container>
      </Container>

      {/* Link */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Link (Config)
        </Heading>
        <Container>
          <Link href="/dashboard">Navigate to Dashboard</Link>
        </Container>
      </Container>

      {/* Card */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Card (Config)
        </Heading>
        <Card
          title="Configured Card Title"
          description="Default card description text using global settings">
          <p>
            Card body content relying on default padding, gap, and variants.
          </p>
        </Card>
      </Container>

      {/* Image */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Image (Config)
        </Heading>
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
          alt="Abstract config test image"
        />
      </Container>

      {/* Accordion */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Accordion (Config)
        </Heading>
        <Accordion
          items={[
            {
              id: "item-1",
              title: "Configured ContContainer 1",
              content:
                "ContContainer content using global spacing and default animation.",
            },
            {
              id: "item-2",
              title: "Configured ContContainer 2",
              content: "Additional panel content driven by configuration.",
            },
          ]}
        />
      </Container>

      {/* Carousel */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Carousel (Config)
        </Heading>
        <Carousel
          items={[
            {
              id: "1",
              content: (
                <Container className="bg-muted p-8 text-center rounded-lg">
                  Slide 1
                </Container>
              ),
            },
            {
              id: "2",
              content: (
                <Container className="bg-muted p-8 text-center rounded-lg">
                  Slide 2
                </Container>
              ),
            },
          ]}
        />
      </Container>

      {/* Parallax */}
      <Container className="space-y-3">
        <Heading level={4} className="text-lg font-semibold">
          Parallax (Config)
        </Heading>
        <Parallax background={<div className="w-full h-full bg-slate-800" />}>
          <h3 className="text-xl font-semibold">Parallax Configured Banner</h3>
        </Parallax>
      </Container>
    </main>
  );
}
