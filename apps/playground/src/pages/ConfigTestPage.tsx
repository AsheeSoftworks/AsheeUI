import {
  Accordion,
  Card,
  Carousel,
  Chip,
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
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Chip (Config)</h2>
        <div className="flex gap-2">
          <Chip>Default Chip</Chip>
          <Chip>Configured Style</Chip>
        </div>
      </section>

      {/* Link */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Link (Config)</h2>
        <div>
          <Link href="/dashboard">Navigate to Dashboard</Link>
        </div>
      </section>

      {/* Card */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Card (Config)</h2>
        <Card
          title="Configured Card Title"
          description="Default card description text using global settings">
          <p>
            Card body content relying on default padding, gap, and variants.
          </p>
        </Card>
      </section>

      {/* Image */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Image (Config)</h2>
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
          alt="Abstract config test image"
        />
      </section>

      {/* Accordion */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Accordion (Config)</h2>
        <Accordion
          items={[
            {
              id: "item-1",
              title: "Configured Section 1",
              content:
                "Section content using global spacing and default animation.",
            },
            {
              id: "item-2",
              title: "Configured Section 2",
              content: "Additional panel content driven by configuration.",
            },
          ]}
        />
      </section>

      {/* Carousel */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Carousel (Config)</h2>
        <Carousel
          items={[
            {
              id: "1",
              content: (
                <div className="bg-muted p-8 text-center rounded-lg">
                  Slide 1
                </div>
              ),
            },
            {
              id: "2",
              content: (
                <div className="bg-muted p-8 text-center rounded-lg">
                  Slide 2
                </div>
              ),
            },
          ]}
        />
      </section>

      {/* Parallax */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Parallax (Config)</h2>
        <Parallax background={<div className="w-full h-full bg-slate-800" />}>
          <h3 className="text-xl font-semibold">Parallax Configured Banner</h3>
        </Parallax>
      </section>
    </main>
  );
}
