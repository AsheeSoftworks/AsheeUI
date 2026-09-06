import { Card } from "asheeui";
import NextImage from "next/image";

export default function CardCustomImageDemo() {
  return (
    <Card
      imageSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
      imageAlt="Mountain landscape"
      imagePosition="top"
      imageRatio="video"
      title="Next.js Image"
      description="Using Next.js Image component for automatic optimization"
      imageComponent={NextImage}
      imageProps={{
        width: 800,
        height: 450,
        priority: true,
        sizes: "(max-width: 768px) 100vw, 800px",
      }}
      className="max-w-md"
    />
  );
}
