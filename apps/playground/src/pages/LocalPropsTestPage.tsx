import {
  Accordion,
  Card,
  Carousel,
  Chip,
  Image,
  Link,
  Parallax,
} from "@ashee/ui";

export default function LocalPropsTestPage() {
  return (
    <main className="max-w-4xl mx-auto p-8 space-y-12">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold">
          Playground: Local Props Overrides
        </h1>
        <p className="text-muted-foreground">
          Testing components using explicit props to override configuration.
        </p>
      </header>

      {/* Chip */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Chip (Local Props)</h2>
        <div className="flex gap-3">
          <Chip variant="solid" color="danger" size="lg" radius="full">
            Critical Alert
          </Chip>
          <Chip variant="bordered" color="primary" size="sm" radius="md">
            Back Step
          </Chip>
        </div>
      </section>

      {/* Link */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Link (Local Props)</h2>
        <div className="flex flex-col gap-2">
          <Link href="https://github.com" variant="danger" size="lg" isExternal>
            External Danger Link
          </Link>
        </div>
      </section>

      {/* Card */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Card (Local Props)</h2>
        <Card
          variant="elevated"
          size="lg"
          radius="xl"
          shadow="lg"
          isClickable
          title="Customized Card Title"
          description="Overridden with local prop settings and shorthand image"
          imageSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
          imageAlt="Abstract thumbnail"
          imagePosition="top"
          imageRatio="video"
          imageFit="cover">
          <p className="text-sm">
            Card body passed directly as standard children.
          </p>
        </Card>
      </section>

      {/* Image */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Image (Local Props)</h2>
        <Image
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
          alt="Abstract render"
          fit="cover"
          ratio="portrait"
          radius="lg"
          shadow="md"
          showSkeleton
        />
      </section>

      {/* Accordion */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Accordion (Local Props)</h2>
        <Accordion
          variant="bordered"
          size="lg"
          radius="lg"
          allowMultiple
          defaultValue={["panel-1"]}
          items={[
            {
              id: "panel-1",
              title: "Explicit Multiple Item 1",
              subtitle: "First section description",
              content: "Multiple panels can remain open concurrently.",
            },
            {
              id: "panel-2",
              title: "Explicit Multiple Item 2",
              subtitle: "Second section description",
              content: "Second panel body text.",
            },
          ]}
        />
      </section>

      {/* Carousel */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Carousel (Local Props)</h2>
        <Carousel
          variant="cards"
          size="lg"
          radius="xl"
          autoPlay
          autoPlayInterval={4000}
          loop
          showControls
          showIndicators
          pauseOnHover
          items={[
            {
              id: "c-1",
              content: (
                <div className="bg-primary/10 p-12 text-center rounded-xl font-bold">
                  Custom Slide 1
                </div>
              ),
            },
            {
              id: "c-2",
              content: (
                <div className="bg-primary/20 p-12 text-center rounded-xl font-bold">
                  Custom Slide 2
                </div>
              ),
            },
          ]}
        />
      </section>

      {/* Parallax */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Parallax (Local Props)</h2>
        <Parallax
          overlay="radial"
          bgSpeed={0.4}
          contentSpeed={-0.2}
          background={
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
              alt="Parallax background"
              className="w-full h-full object-cover"
            />
          }
          layers={[
            {
              id: "layer-1",
              speed: 0.6,
              className: "top-10 left-10",
              content: (
                <div className="p-4 bg-white/10 backdrop-blur rounded-lg text-white font-semibold">
                  Floating Layer Node
                </div>
              ),
            },
          ]}>
          <h2 className="text-3xl font-bold">
            Fast Parallax with Radial Overlay
          </h2>
        </Parallax>
      </section>
    </main>
  );
}
